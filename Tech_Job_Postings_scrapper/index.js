const axios = require('axios');
const cheerio = require('cheerio');
const xlsx = require('xlsx');
const fs = require('fs');

const scrapeTechJobPostings = async () => {
    try {
        const url = 'https://www.timesjobs.com/candidate/job-search.html?searchType=Home_Search&from=submit&asKey=OFF&txtKeywords=&cboPresFuncArea=35';

        const { data: html } = await axios.get(url);
        const $ = cheerio.load(html);

        const jobs = [];

        $(".job-bx").each((index, element) => {
            const jobTitle = $(element).find(".heading-trun a").text().trim();
            const companyName = $(element)
              .find(".joblist-comp-name")
              .text()
              .trim();
            const location = $(element)
              .find(".srp-zindex.location-tru")
              .text()
              .trim();
            const jobType = $(element)
              .find(".job-type")
              .text()
              .trim() || "Not specified";
            const postedDate = $(element)
              .find(".sim-posted span")
              .text()
              .trim();
            const jobDescription = $(element)
              .find(".list-job-dtl li:first-child")
              .text()
              .trim();
      
            jobs.push({
              JobTitle: jobTitle,
              CompanyName: companyName,
              Location: location,
              JobType: jobType,
              PostedDate: postedDate,
              JobDescription: jobDescription,
            });
          });
      
          // Save data to Excel
          const worksheet = xlsx.utils.json_to_sheet(jobs);
          const workbook = xlsx.utils.book_new();
          xlsx.utils.book_append_sheet(workbook, worksheet, "TechJobs");
      
          // Create directory if not exists
          if (!fs.existsSync("./data")) {
            fs.mkdirSync("./data");
          }
      
          const filePath = "./data/tech_jobs.xlsx";
          xlsx.writeFile(workbook, filePath);
      
          console.log(`Scraping completed. Data saved to ${filePath}`);
        }
        catch (error) {
          console.error("Error during scraping:", error.message);
    }
};

scrapeTechJobPostings();
