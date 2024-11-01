
'use client'
import React, { useState, useEffect,useRef, RefObject  } from "react";
import emailjs from "emailjs-com";

interface Option {
  name: string;
  imageUrl: string;
}

interface Categories {
  [category: string]: Option[];
}

// EmailJS template parameters type
interface TemplateParams {
  to_name: string;
  from_name: string;
  message: string;
  timestamp: string;
}

const API_KEY = "AIzaSyAhJQx4Qfh988WO6OIV0pad3lTPKwIqY8k"; // Replace with your API Key
const SHEET_ID = "1og57HocF2-nKTBiDK6wr4OowtuhezgvGF93C6U4N83U"; // Replace with your Google Sheet ID
const EMAILJS_SERVICE_ID = "service_sesjkff"; // Replace with your EmailJS Service ID
const EMAILJS_TEMPLATE_ID = "template_qc8kgfi"; // Replace with your EmailJS Template ID
const EMAILJS_USER_ID = "hHa6kbIOnuayN1wK6"; // Replace with your EmailJS User ID

export default function Home(): JSX.Element {
  const [categories, setCategories] = useState<Categories>({});
  const [selectedOptions, setSelectedOptions] = useState<{ [category: string]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Reference array to store each category element for scrolling
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Fetch categories and options from Google Sheets
  useEffect(() => {
    const fetchCategories = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!A:C?key=${API_KEY}`
        );
        const data = await response.json();
        const categoriesData: Categories = {};

        data.values.slice(1).forEach((row: string[]) => {
          const category = row[0];
          const option: Option = { name: row[1], imageUrl: row[2] };

          if (!categoriesData[category]) {
            categoriesData[category] = [];
          }
          categoriesData[category].push(option);
        });

        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleOptionSelect = (categoryIndex: number, category: string, option: string): void => {
    setSelectedOptions((prev) => ({
      ...prev,
      [category]: option,
    }));

    // Scroll to the next category if it exists
    const nextCategoryIndex = categoryIndex + 1;
    if (nextCategoryIndex < Object.keys(categories).length) {
      setTimeout(() => {
        categoryRefs.current[nextCategoryIndex]?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 200);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (Object.keys(selectedOptions).length === Object.keys(categories).length) {
      try {
        const csvContent = Object.entries(selectedOptions)
          .map(([category, option]) => `- ${category}: ${option}`)
          .join("\n");

        const templateParams: TemplateParams = {
          to_name: "Your Name",
          from_name: "Halloween Voting App",
          message: `Vote details:\n\n${csvContent}`,
          timestamp: new Date().toLocaleString(),
        };

        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          templateParams,
          EMAILJS_USER_ID
        );

        setSubmitted(true);
      } catch (error) {
        console.error("Error sending email:", error);
      }
    } else {
      alert("Please select an option in each category.");
    }
  };

  const isOptionDisabled = (category: string, option: string): boolean => {
    return Object.keys(selectedOptions).some(
      (cat) => selectedOptions[cat] === option && cat !== category
    );
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="thank-you-screen">
        <h2>The Choice is Bound in Shadow</h2>
        <p>Your vote has been recorded. The spirits thank you for your cooperation.</p>
      </div>
    );
  }

  return (
    <div className="App">
      <h2>Bestow Your Favour Upon a Phantom</h2>
      <div className="categories-container">
        {Object.keys(categories).map((category, index) => (
          <div
            key={category}
            className="category"
            ref={(el) => (categoryRefs.current[index] = el)}
          >
            <h3 className="sticky-header">{category}</h3>
            <div className="options">
              {categories[category].map((opt) => (
                <label
                  key={opt.name}
                  className={`option-label ${
                    selectedOptions[category] === opt.name ? "selected" : ""
                  } ${isOptionDisabled(category, opt.name) ? "disabled" : ""}`}
                  onClick={() =>
                    !isOptionDisabled(category, opt.name) &&
                    handleOptionSelect(index, category, opt.name)
                  }
                  style={{
                    opacity: isOptionDisabled(category, opt.name) ? 0.5 : 1,
                    pointerEvents: isOptionDisabled(category, opt.name)
                      ? "none"
                      : "auto",
                  }}
                >
                  <img src={opt.imageUrl} alt={opt.name} />
                  <div className="name-overlay">{opt.name}</div>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className={`submit-button ${
          Object.keys(selectedOptions).length === Object.keys(categories).length
            ? "enabled"
            : ""
        }`}
        disabled={Object.keys(selectedOptions).length !== Object.keys(categories).length}
      >
        Submit Vote
      </button>
    </div>
  );
}