
import { GoogleGenAI, Type } from "@google/genai";
import { CATEGORIES } from "../constants";

export interface MultimodalPart {
  inlineData?: {
    mimeType: string;
    data: string;
  };
  text?: string;
}

export interface ParsedTransaction {
  amount: number;
  categoryId: string;
  type: 'expense' | 'income';
  note: string;
}

export const geminiService = {
  async parseMultimodal(parts: MultimodalPart[]): Promise<ParsedTransaction[] | null> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const categoryNames = CATEGORIES.map(c => `${c.name} (ID: ${c.id}, 类型: ${c.type === 'expense' ? '支出' : '收入'})`).join(', ');

    const systemInstruction = `你是一个极其严谨的财务会计，负责商品级账单拆解。
      
      【核心任务】
      从图片、语音或文字中提取【具体商品条目】。不要仅仅按照分类合并，要尽可能保留商品的独立性。
      
      【处理原则】
      1. **条目化拆分**：如果用户买了多样物品，即使它们属于同一个分类（例如牛奶和啤酒都属于餐饮），也请将它们拆分为独立的账单记录。
         - 示例：图片中有“牛奶 15元”和“啤酒 10元”，你应该生成两条记录。
      2. **分类匹配**：根据商品属性，从可选列表中选择最精准的分类。
         - 牛奶、啤酒、蔬菜 -> 餐饮 (food)
         - 洗发水、纸巾、毛巾 -> 购物 (shopping)
         - 药品、口罩 -> 医疗 (health)
      3. **备注优化**：备注直接写商品名称（如果有商户名，可以加上）。格式示例：“[商户] - [商品名]”。
      4. **精确金额**：提取该单项商品的实际成交价。
      5. **实付总额校验**：所有拆分后的单项金额之和必须等于原始收据的实付总金额。
      
      可选分类 ID 列表: ${categoryNames}。
      今天日期是 ${new Date().toLocaleDateString('zh-CN')}。
      
      请只返回一个符合 JSON 格式的数组。`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { 
        parts: [
          { text: systemInstruction },
          ...parts
        ] 
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              amount: { type: Type.NUMBER, description: "该单项商品的金额" },
              categoryId: { type: Type.STRING, description: "对应的分类ID" },
              type: { type: Type.STRING, enum: ['expense', 'income'] },
              note: { type: Type.STRING, description: "备注，格式：商户-商品名，如：盒马-牛奶" },
            },
            required: ["amount", "categoryId", "type", "note"],
          }
        },
      },
    });

    try {
      const textOutput = response.text || '[]';
      const results: ParsedTransaction[] = JSON.parse(textOutput);
      
      // 验证并过滤数据，确保 categoryId 在预定义范围内
      return results.map(result => ({
        ...result,
        categoryId: CATEGORIES.find(c => c.id === result.categoryId) ? result.categoryId : (result.type === 'income' ? 'other_inc' : 'other_exp')
      }));
    } catch (e) {
      console.error("AI Parse Error:", e);
      return null;
    }
  }
};
