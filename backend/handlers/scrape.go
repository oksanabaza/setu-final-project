package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/antchfx/htmlquery"
	"github.com/gocolly/colly/v2"
)

type ScrapeRequest struct {
	Links    []string          `json:"links"`
	Elements map[string]string `json:"elements"`
	Wrapper  string            `json:"wrapper,omitempty"`
	IsXPath  bool              `json:"is_xpath"`
	Type     string            `json:"type"`
}

type ScrapeResponse struct {
	URL   string            `json:"url"`
	Data  map[string]string `json:"data"`
	Error string            `json:"error,omitempty"`
}

func ScrapeHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST supported", http.StatusMethodNotAllowed)
		return
	}

	var req ScrapeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON request", http.StatusBadRequest)
		return
	}

	log.Printf("Received request: %+v\n", req)

	var results []ScrapeResponse

	switch req.Type {
	case "shallow":
		results = scrapeShallow(req)
	case "detailed":
		results = scrapeDetailed(req)
	default:
		http.Error(w, "Invalid scrape type", http.StatusBadRequest)
		return
	}

	log.Printf("Scraping finished, results: %+v\n", results)

	// save the file
	saveToJSON(results)

	// Set the correct Content-Type header and return JSON response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(results) // Send the JSON response
}

// Save result to JSON file
func saveToJSON(results []ScrapeResponse) {
	timestamp := time.Now().Format("2006-01-02_15-04-05")
	filename := fmt.Sprintf("scraped_data_%s.json", timestamp)

	file, err := os.Create(filename)
	if err != nil {
		log.Println("Error creating JSON file:", err)
		return
	}
	defer file.Close()

	encoder := json.NewEncoder(file)
	encoder.SetIndent("", "  ") // Pretty JSON format
	if err := encoder.Encode(results); err != nil {
		log.Println("Error writing JSON file:", err)
	}

	fmt.Println("Scraped data saved to", filename)
}

// Shallow Scraping
func scrapeShallow(req ScrapeRequest) []ScrapeResponse {
	c := colly.NewCollector()
	var results []ScrapeResponse
	var mu sync.Mutex
	var wg sync.WaitGroup

	for _, url := range req.Links {
		wg.Add(1)
		go func(url string) {
			defer wg.Done()
			log.Println("Visiting:", url)

			var data map[string]string

			c.OnHTML("*", func(e *colly.HTMLElement) {
				log.Println("Page loaded:", e.Request.URL.String())
			})

			c.OnHTML(req.Wrapper, func(e *colly.HTMLElement) {
				log.Println("Wrapper matched:", req.Wrapper)
				data = make(map[string]string)
				for key, selector := range req.Elements {
					text := e.ChildText(selector)
					log.Printf("Extracted text for key %s: %s\n", key, text)
					data[key] = text
				}
				log.Printf("Extracted data from %s: %+v\n", url, data)
			})

			err := c.Visit(url)
			if err != nil {
				log.Printf("Error visiting URL %s: %v\n", url, err)
			}
			res := ScrapeResponse{URL: url, Data: data}
			if err != nil {
				res.Error = err.Error()
			}

			mu.Lock()
			results = append(results, res)
			mu.Unlock()
		}(url)
	}

	wg.Wait()
	return results
}

// Detailed Scraping
func scrapeDetailed(req ScrapeRequest) []ScrapeResponse {
	c := colly.NewCollector()
	var results []ScrapeResponse

	c.OnHTML("*", func(e *colly.HTMLElement) {
		log.Println("Page loaded:", e.Request.URL.String())
	})

	c.OnHTML("html", func(e *colly.HTMLElement) {
		data := make(map[string]string)
		htmlContent, err := e.DOM.Html()
		if err != nil {
			log.Println("Error getting HTML content:", err)
			return
		}

		doc, err := htmlquery.Parse(strings.NewReader(htmlContent))
		if err != nil {
			log.Println("Error parsing HTML:", err)
			return
		}

		for key, selector := range req.Elements {
			nodes := htmlquery.Find(doc, selector)
			log.Printf("Found %d nodes for selector %s\n", len(nodes), selector)
			if len(nodes) > 0 {
				data[key] = strings.TrimSpace(htmlquery.InnerText(nodes[0]))
			}
		}

		log.Printf("Extracted detailed data: %+v\n", data)
		results = append(results, ScrapeResponse{URL: e.Request.URL.String(), Data: data})
	})

	for _, link := range req.Links {
		log.Println("Visiting detailed URL:", link)
		_ = c.Visit(link)
	}

	return results
}
