import { ApiResponse, ApisauceInstance, create } from "apisauce"
import { GeneralApiProblem, getGeneralApiProblem } from "app/services/api/apiProblem"

export type Quote = {
  quoteText: string
  quoteAuthor: string
  senderName: string
  senderLink: string
  quoteLink: string
}

class Api {
  private apisauce: ApisauceInstance

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor() {
    this.apisauce = create({
      baseURL: "https://api.forismatic.com/api/1.0/",
      timeout: 10000,
      headers: {
        Accept: "application/json",
      },
    })
  }

  async getQuote(lang: string): Promise<{ kind: "ok"; quote: Quote } | GeneralApiProblem> {
    const response: ApiResponse<Quote | string> = await this.apisauce.get("", {
      method: "getQuote",
      format: "json",
      lang,
    })

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const rawQuote = response.data
      if (!rawQuote) return { kind: "bad-data" }

      const parsedQuote: Quote = typeof rawQuote === "string" ? JSON.parse(rawQuote) : rawQuote

      if (
        typeof parsedQuote.quoteText !== "string" ||
        typeof parsedQuote.quoteAuthor !== "string" ||
        typeof parsedQuote.senderName !== "string" ||
        typeof parsedQuote.senderLink !== "string" ||
        typeof parsedQuote.quoteLink !== "string"
      ) {
        return { kind: "bad-data" }
      }

      return { kind: "ok", quote: parsedQuote }
    } catch (error) {
      return { kind: "bad-data" }
    }
  }
}

export const api = new Api()
