type NamedDocument = { name: string }
type DatedDocument = { createdAt: string }
type ActionableDocument = { action: string }
type SizedDocument = { sizeMb?: number | string }

export const sortByCreatedAtDesc = <T extends DatedDocument>(items: T[]) =>
  [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

export const filterDocuments = <T extends NamedDocument & ActionableDocument>(
  items: T[],
  options: {
    query?: string
    action?: string
  },
) => {
  const { query = '', action } = options
  const byAction =
    action && action !== 'all' ? items.filter((item) => item.action === action) : items
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) return byAction
  return byAction.filter((item) => item.name.toLowerCase().includes(normalizedQuery))
}

export const sumDocumentSizeMb = <T extends SizedDocument>(items: T[]) =>
  items.reduce((total, item) => total + Number(item.sizeMb || 0), 0)

export const countDocumentsByAction = <T extends ActionableDocument>(
  items: T[],
  actions: readonly string[],
) =>
  actions.reduce<Record<string, number>>((acc, action) => {
    acc[action] = items.filter((item) => item.action === action).length
    return acc
  }, {})
