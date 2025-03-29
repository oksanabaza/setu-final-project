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

	// Log the request method and headers
	log.Printf("Received request: %s %s\n", r.Method, r.URL.Path)
	for name, values := range r.Header {
		log.Printf("Header: %s = %s\n", name, values)
	}

	// Check for correct HTTP method
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST supported", http.StatusMethodNotAllowed)
		return
	}

	// Decode the JSON body into ScrapeRequest
	var req ScrapeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON request", http.StatusBadRequest)
		log.Printf("Error decoding JSON: %v\n", err)
		return
	}

	log.Printf("Decoded request: %+v\n", req)

	// Prepare results variable
	var results []ScrapeResponse

	// Choose the scraping method based on the type
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

	// Save the results to a JSON file
	saveToJSON(results)

	// Set the correct Content-Type header and return the results as JSON
	// w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	err := json.NewEncoder(w).Encode(results)
	if err != nil {
		log.Printf("Error encoding response: %v\n", err)
	}
}

// Save the result to a JSON file
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

func scrapeShallow(req ScrapeRequest) []ScrapeResponse {
	fmt.Println("shallow triggered with request:", req)

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
			var foundWrapper bool // Track if wrapper is found

			c.OnHTML("*", func(e *colly.HTMLElement) {
				log.Println("Page loaded:", e.Request.URL.String())
			})

			// Check if Wrapper is specified and then match it
			if req.Wrapper != "" {

				c.OnHTML(req.Wrapper, func(e *colly.HTMLElement) {
					foundWrapper = true
					log.Println("Wrapper matched:", req.Wrapper)

					data = make(map[string]string)
					for key, selector := range req.Elements {
						text := e.ChildText(selector)
						if text == "" {
							log.Printf("Warning: No text found for key '%s' using selector '%s'\n", key, selector)
						}
						data[key] = text
					}
					log.Printf("Extracted data from %s: %+v\n", url, data)
				})
			} else {
				log.Printf("No wrapper specified for %s\n", url)
			}

			// Wrapper Not Found
			c.OnScraped(func(r *colly.Response) {
				if !foundWrapper && req.Wrapper != "" {
					log.Printf("Error: Wrapper '%s' not found on page %s\n", req.Wrapper, url)
				}
			})

			// Visiting Error
			err := c.Visit(url)
			if err != nil {
				log.Printf("Error visiting URL %s: %v\n", url, err)
			}

			// Prepare response
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

// Detailed Scraping: Using colly and htmlquery for more complex scraping
func scrapeDetailed(req ScrapeRequest) []ScrapeResponse {
	fmt.Print("detailed triggered")
	c := colly.NewCollector()
	var results []ScrapeResponse

	// General callback for page load
	c.OnHTML("*", func(e *colly.HTMLElement) {
		log.Println("Page loaded:", e.Request.URL.String())
	})

	// Callback for extracting HTML content
	c.OnHTML("html", func(e *colly.HTMLElement) {
		data := make(map[string]string)
		htmlContent, err := e.DOM.Html()
		if err != nil {
			log.Println("Error getting HTML content:", err)
			return
		}

		// Parse the HTML content using htmlquery
		doc, err := htmlquery.Parse(strings.NewReader(htmlContent))
		if err != nil {
			log.Println("Error parsing HTML:", err)
			return
		}

		// Extract data based on selectors
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

	// Visit each link in the request
	for _, link := range req.Links {
		log.Println("Visiting detailed URL:", link)
		_ = c.Visit(link)
	}

	return results
}
