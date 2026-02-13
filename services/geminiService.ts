
import { GoogleGenAI } from "@google/genai";
import { Appointment } from "../types";

// Fix: Initializing GoogleGenAI using the named parameter as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSalesPitch = async (appointment: Appointment): Promise<string> => {
  try {
    // Fix: Using ai.models.generateContent with the recommended model for text tasks.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Tu es un assistant de vente expert. 
      Génère un court argumentaire de vente (pitch) de 3 points clés pour un commercial terrain qui va rencontrer le client suivant :
      - Entreprise : ${appointment.company}
      - Client : ${appointment.clientName}
      - Motif : ${appointment.purpose}
      - Notes : ${appointment.notes}
      
      Le ton doit être professionnel et persuasif. Réponds en français.`,
      config: {
        temperature: 0.7,
      }
    });

    // Fix: Accessing response.text directly as a property, not a method, as specified in guidelines.
    return response.text || "Impossible de générer un argumentaire pour le moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Erreur lors de la génération de l'argumentaire.";
  }
};
