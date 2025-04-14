import { ResponsiveSunburst } from '@nivo/sunburst'

const data = {
  name: "Web Scraping",
  color: "hsl(200, 70%, 50%)",
  children: [
    {
      name: "E-commerce",
      color: "hsl(50, 70%, 50%)",
      children: [
        { name: "Product Details", loc: 300 },
        { name: "Prices", loc: 250 },
        { name: "Reviews", loc: 200 },
        { name: "Stock Availability", loc: 180 }
      ]
    },
    {
      name: "Real Estate",
      color: "hsl(100, 70%, 50%)",
      children: [
        { name: "Listings", loc: 220 },
        { name: "Prices", loc: 180 },
        { name: "Agents", loc: 130 },
        { name: "Property Features", loc: 160 }
      ]
    },
    {
      name: "Jobs",
      color: "hsl(150, 70%, 50%)",
      children: [
        { name: "Job Titles", loc: 210 },
        { name: "Companies", loc: 180 },
        { name: "Salaries", loc: 160 },
        { name: "Locations", loc: 150 }
      ]
    },
    {
      name: "News",
      color: "hsl(200, 70%, 50%)",
      children: [
        { name: "Headlines", loc: 300 },
        { name: "Article Body", loc: 270 },
        { name: "Authors", loc: 100 },
        { name: "Publish Dates", loc: 90 }
      ]
    },
    {
      name: "Social Media",
      color: "hsl(250, 70%, 50%)",
      children: [
        { name: "Usernames", loc: 200 },
        { name: "Posts", loc: 260 },
        { name: "Likes/Shares", loc: 180 },
        { name: "Comments", loc: 220 }
      ]
    },
    {
      name: "Travel",
      color: "hsl(300, 70%, 50%)",
      children: [
        { name: "Flights", loc: 160 },
        { name: "Hotels", loc: 190 },
        { name: "Reviews", loc: 150 },
        { name: "Prices", loc: 140 }
      ]
    }
  ]
};

const SunburstChart = () => {
  return (
    <div style={{ height: '500px' }}> 
     <ResponsiveSunburst
        data={data}
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        id="name"
        value="loc"
        cornerRadius={2}
        borderColor={{ theme: 'background' }}
        colors={{ scheme: 'nivo' }}
        childColor={{
            from: 'color',
            modifiers: [
                [
                    'brighter',
                    0.1
                ]
            ]
        }}
        enableArcLabels={true}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    1.4
                ]
            ]
        }}
    />
    </div>
  );
};

export default SunburstChart;
