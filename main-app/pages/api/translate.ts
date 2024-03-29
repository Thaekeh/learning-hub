import { NextApiRequest, NextApiResponse } from "next";
import { translateWord } from "utils/azure/translation/translation";

type Data = {
  translation: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;
  switch (method) {
    case "POST":
      const { word, targetLanguage, sourceLanguage } = req.body;
      if (!word || !targetLanguage) {
        throw new Error("invalid props");
      }
      const translation = await translateWord(
        word,
        sourceLanguage,
        targetLanguage
      );
      res.status(200).send({ translation });
  }
}
