package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"sync"

	"github.com/PuerkitoBio/goquery"
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
	Links []string          `json:"links,omitempty"`
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

	// saveToJSON(results)

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(results)
}

// func saveToJSON(results []ScrapeResponse) {
// 	filename := fmt.Sprintf("scraped_data_%s.json", time.Now().Format("2006-01-02_15-04-05"))
// 	file, err := os.Create(filename)
// 	if err != nil {
// 		log.Println("Error creating JSON file:", err)
// 		return
// 	}
// 	defer file.Close()

// 	encoder := json.NewEncoder(file)
// 	encoder.SetIndent("", "  ")
// 	_ = encoder.Encode(results)
// }

func scrapeShallow(req ScrapeRequest) []ScrapeResponse {
	c := colly.NewCollector()
	var results []ScrapeResponse
	var mu sync.Mutex
	var wg sync.WaitGroup

	visited := make(map[string]bool)
	seenData := make(map[string]bool)

	for _, url := range req.Links {
		wg.Add(1)
		go func(url string) {
			defer wg.Done()

			var extractedLinks []string
			var dataList []map[string]string

			c.OnHTML(req.Wrapper, func(e *colly.HTMLElement) {
				e.ForEach("*", func(i int, item *colly.HTMLElement) {
					data := make(map[string]string)
					for key, selector := range req.Elements {
						var extractedData string

						if isXPath(selector) {
							// Debugging: Print the raw HTML
							log.Println("HTML content:", e.Text)

							// Parse the HTML with htmlquery
							docParsed, err := htmlquery.Parse(strings.NewReader(e.Text))
							if err != nil {
								log.Println("Error parsing HTML:", err)
								continue
							}

							// Find elements using XPath
							nodes := htmlquery.Find(docParsed, selector)
							if len(nodes) > 0 {
								extractedData = strings.TrimSpace(htmlquery.InnerText(nodes[0]))
								log.Printf("XPath result for %s: %s", selector, extractedData) // Debugging line
							} else {
								log.Printf("No results for XPath selector: %s", selector) // Debugging line
							}
						} else {
							extractedData = item.ChildText(selector)
						}

						if extractedData != "" {
							data[key] = extractedData
						} else {
							data[key] = "No data"
						}
					}

					item.DOM.Find("a").Each(func(i int, s *goquery.Selection) {
						href, _ := s.Attr("href")
						if href != "" {
							data["URL"] = href
							extractedLinks = append(extractedLinks, href)
						}
					})

					dataList = append(dataList, data)
				})
			})

			// Scrape only if the URL hasn't been visited yet
			if !visited[url] {
				visited[url] = true
				err := c.Visit(url)
				if err != nil {
					mu.Lock()
					results = append(results, ScrapeResponse{URL: url, Error: err.Error()})
					mu.Unlock()
				} else {
					mu.Lock()
					for _, data := range dataList {
						hasNonEmptyField := false
						uniqueKey := ""

						for key, value := range data {
							if value != "" {
								hasNonEmptyField = true
							}
							if key == "description" || key == "price" || key == "title" {
								uniqueKey += value
							}
						}

						if hasNonEmptyField && !seenData[uniqueKey] {
							seenData[uniqueKey] = true
							results = append(results, ScrapeResponse{
								URL:  url,
								Data: data,
							})
						}
					}
					mu.Unlock()
				}
			}
		}(url)
	}

	wg.Wait()
	return results
}

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

		// Parse the HTML content using goquery (for CSS selectors)
		doc := e.DOM

		for key, selector := range req.Elements {
			var extractedData string

			if isXPath(selector) {
				// If the selector looks like an XPath, use htmlquery
				docParsed, err := htmlquery.Parse(strings.NewReader(htmlContent))
				if err != nil {
					log.Println("Error parsing HTML:", err)
					continue
				}

				// Use htmlquery to find the nodes based on the XPath
				nodes := htmlquery.Find(docParsed, selector)
				if len(nodes) > 0 {
					// Extract the inner text of the first matching node
					extractedData = strings.TrimSpace(htmlquery.InnerText(nodes[0]))
				}
			} else {
				// Otherwise, treat it as a CSS selector and use goquery
				elements := doc.Find(selector)
				if elements.Length() > 0 {
					// Extract text from the first element matching the CSS selector
					extractedData = strings.TrimSpace(elements.First().Text())
				}
			}

			// Store the extracted data if any was found
			if extractedData != "" {
				data[key] = extractedData
			}
		}

		log.Printf("Extracted detailed data: %+v\n", data)
		// Append the extracted data to the results
		results = append(results, ScrapeResponse{URL: e.Request.URL.String(), Data: data})
	})

	// Visit each link in the request
	for _, link := range req.Links {
		log.Println("Visiting detailed URL:", link)
		_ = c.Visit(link)
	}

	// Return the results after visiting all the links
	return results
}

// Helper function to check if the selector is an XPath
func isXPath(selector string) bool {
	// Check if the selector starts with '/' or contains '//' indicating an XPath
	selector = strings.TrimSpace(selector)
	return strings.HasPrefix(selector, "/") || strings.Contains(selector, "//")
}
