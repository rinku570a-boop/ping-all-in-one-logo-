
import { GoogleGenAI } from "@google/genai";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getBusinessInsights = async (data: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `এখানে আমার আই এস পি (Ping Online) এর ব্যবসায়িক ডাটা দেয়া হলো: ${JSON.stringify(data)}. এই ডাটা বিশ্লেষণ করে বাংলায় ৩টি গুরুত্বপূর্ণ পরামর্শ দিন কীভাবে ব্যবসায় লাভ বাড়ানো যায় বা খরচ কমানো যায়।`,
      config: {
        systemInstruction: "You are a professional business analyst for ISPs in Bangladesh. Speak in Bengali.",
        temperature: 0.7,
      }
    });
    // The GenerateContentResponse object features a text property that directly returns the string output.
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "দুঃখিত, এই মুহূর্তে পরামর্শ পাওয়া যাচ্ছে না।";
  }
};
