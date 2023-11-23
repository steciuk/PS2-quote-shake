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
    const response: ApiResponse<Quote> = await this.apisauce.get("", {
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
      if (typeof rawQuote.quoteText !== "string") return { kind: "bad-data" }
      if (typeof rawQuote.quoteAuthor !== "string") return { kind: "bad-data" }
      if (typeof rawQuote.senderName !== "string") return { kind: "bad-data" }
      if (typeof rawQuote.senderLink !== "string") return { kind: "bad-data" }
      if (typeof rawQuote.quoteLink !== "string") return { kind: "bad-data" }

      return { kind: "ok", quote: rawQuote }
    } catch (error) {
      return { kind: "bad-data" }
    }
  }
}

export const api = new Api()
