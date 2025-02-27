export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Use environment variable for API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

interface AnalysisResult {
  score: number | null;
  accomplishments: string[];
  improvements: string[];
  tips: string[];
  rawAnalysis: string;
}

function parseAnalysis(text: string): AnalysisResult {
  const sections = text.split('\n\n');
  const result: AnalysisResult = {
    score: null,
    accomplishments: [],
    improvements: [],
    tips: [],
    rawAnalysis: text
  };

  sections.forEach(section => {
    if (section.includes('PRODUCTIVITY SCORE')) {
      const scoreMatch = section.match(/PRODUCTIVITY SCORE:\s*(\d+)/);
      result.score = scoreMatch ? parseInt(scoreMatch[1], 10) : null;
    } else if (section.includes('KEY ACCOMPLISHMENTS')) {
      result.accomplishments = section
        .split('\n')
        .slice(1) // Skip the title
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(Boolean);
    } else if (section.includes('AREAS FOR IMPROVEMENT')) {
      result.improvements = section
        .split('\n')
        .slice(1)
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(Boolean);
    } else if (section.includes('ACTIONABLE TIPS')) {
      result.tips = section
        .split('\n')
        .slice(1)
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(Boolean);
    }
  });

  return result;
}

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();
    
    const prompt = `Analyze this daily journal entry and provide productivity feedback:
    "${content}"
    
    Format your response exactly like this example (replace with actual analysis):
    PRODUCTIVITY SCORE: 75/100

    KEY ACCOMPLISHMENTS:
    1. Completed project presentation
    2. Attended team meetings
    3. Organized workspace

    AREAS FOR IMPROVEMENT:
    1. Time management
    2. Task prioritization
    3. Meeting efficiency

    ACTIONABLE TIPS:
    1. Use time-blocking technique
    2. Create daily priority list
    3. Set specific goals for meetings

    Keep responses concise and actionable.`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const analysis = await result.response.text();
    
    // Clean up any potential markdown or extra formatting
    const cleanAnalysis = analysis
      .replace(/\*\*/g, '')
      .replace(/`/g, '')
      .trim();

    const analysisResult = parseAnalysis(cleanAnalysis);
    console.log('📊 Parsed analysis:', analysisResult);

    return NextResponse.json({ 
      success: true,
      analysis: cleanAnalysis,
      ...analysisResult
    });
  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to process request" 
      },
      { status: 500 }
    );
  }
}