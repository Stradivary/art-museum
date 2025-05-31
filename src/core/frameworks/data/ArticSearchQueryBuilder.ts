// ArticSearchQueryBuilder.ts
// Utility class to build Art Institute of Chicago API search queries (Elasticsearch style)

export type AggregationParam = {
  field: string
  size: number
  include?: string
}

export class ArticSearchQueryBuilder {
  // Build a list aggregation (facet)
  static buildListAggregation(
    name: string,
    parameter: AggregationParam,
    queryFilter?: string
  ): Record<string, unknown> {
    const agg: Record<
      string,
      {
        terms: {
          field: string
          size: number
          include?: string
        }
      }
    > = {
      [name]: {
        terms: {
          field: parameter.field,
          size: parameter.size,
        },
      },
    }

    if (queryFilter && queryFilter.length > 0) {
      const firstLetter: string = `${queryFilter[0]}`
      const rest = queryFilter.slice(1)
      const pattern = `.*[${firstLetter.toUpperCase()}${firstLetter.toLowerCase()}]${rest}.*`

      agg[name].terms.include = pattern
    }
    return agg
  }

  // Recent acquisition year logic
  static recentAcquisitionConsideredYear(date: Date = new Date()): number {
    const curMonth = date.getMonth() + 1
    const curHalf = Math.ceil(curMonth / 6)
    return date.getFullYear() - (curHalf % 2)
  }

  // Build a bool must term filter
  static mustTerm(
    field: string,
    value: string | number | boolean
  ): Record<string, unknown> {
    return { term: { [field]: value } }
  }

  // Build a bool must range filter
  static mustRange(
    field: string,
    gte?: string | number,
    lte?: string | number
  ): Record<string, unknown> {
    const range: Record<string, string | number> = {}
    if (gte !== undefined) range.gte = gte
    if (lte !== undefined) range.lte = lte
    return { range: { [field]: range } }
  }

  // Build a color filter (HSL)
  static colorQuery(h: number, s: number, l: number) {
    // Match percentInterval logic from PHP
    const hi = 12.5
    const si = 30
    const li = 30
    const hueMin = h - (hi / 2 / 100) * 360
    const hueMax = h + (hi / 2 / 100) * 360
    const hueQueries = [
      {
        range: {
          'color.h': {
            gte: Math.max(hueMin, 0),
            lte: Math.min(hueMax, 360),
          },
        },
      },
    ]
    if (hueMin < 0) {
      hueQueries.push({
        range: {
          'color.h': {
            gte: hueMin + 360,
            lte: 360,
          },
        },
      })
    }
    if (hueMax > 360) {
      hueQueries.push({
        range: {
          'color.h': {
            gte: 0,
            lte: hueMax - 360,
          },
        },
      })
    }
    return {
      bool: {
        must: [
          { bool: { should: hueQueries } },
          {
            range: {
              'color.s': {
                gte: Math.max(s - si / 2, 0),
                lte: Math.min(s + si / 2, 100),
              },
            },
          },
          {
            range: {
              'color.l': {
                gte: Math.max(l - li / 2, 0),
                lte: Math.min(l + li / 2, 100),
              },
            },
          },
        ],
      },
    }
  }

  // Build a year range filter
  static yearRange(min: number, max?: number) {
    const now = new Date().getFullYear()
    return {
      bool: {
        must: [
          this.mustRange('date_start', min),
          this.mustRange('date_end', undefined, max ?? now),
        ],
      },
    }
  }

  // Build a public domain filter
  static publicDomain(value: boolean = true) {
    return {
      bool: {
        must: [this.mustTerm('is_public_domain', value)],
      },
    }
  }

  // Build a on view filter
  static onView(value: boolean = true) {
    return {
      bool: {
        must: [this.mustTerm('is_on_view', value)],
      },
    }
  }

  // Build a filter for a list of IDs
  static byIds(ids: (string | number)[]) {
    return {
      terms: {
        id: ids,
      },
    }
  }
}
