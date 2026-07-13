import { useState, useMemo, Fragment } from 'react'

// Interactive island: sortable table (desktop) + stacked cards (mobile),
// with an expandable detail panel per product. Products arrive with a
// pre-built, affiliate-tagged `amazonUrl` from the Astro page.

const isNum = (v) => typeof v === 'number' && Number.isFinite(v)
const isEmpty = (v) => v == null || v === ''

function Stars({ value }) {
  if (!isNum(value)) return null
  const full = Math.floor(value)
  const half = value - full >= 0.5
  const cls = (i) => (i < full ? 'full' : i === full && half ? 'half' : 'empty')
  return (
    <span className="stars" aria-label={`${value} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className={`stars__star stars__star--${cls(i)}`}>★</span>
      ))}
      <span className="stars__num">{value.toFixed(1)}</span>
    </span>
  )
}

function Buy({ url }) {
  return (
    <a className="buy" href={url} target="_blank" rel="sponsored nofollow noopener noreferrer">
      Check price <span aria-hidden="true">↗</span>
    </a>
  )
}

function formatCell(product, col) {
  const raw = product[col.key]
  if (isEmpty(raw)) return '—'
  if (col.type === 'rating') return <Stars value={raw} />
  if (col.type === 'number') return `${raw}${col.suffix || ''}`
  return raw
}

function Detail({ product }) {
  return (
    <div className="detail">
      <div className="detail__meta">
        <Stars value={product.rating} />
        {isNum(product.reviews) && <span>{product.reviews.toLocaleString()} ratings</span>}
      </div>
      {product.blurb && <p className="detail__blurb">{product.blurb}</p>}
    </div>
  )
}

export default function ComparisonTable({ columns, products }) {
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [openId, setOpenId] = useState(null)

  const sorted = useMemo(() => {
    if (!sortKey) return products
    const dir = sortDir === 'asc' ? 1 : -1
    return [...products].sort((a, b) => {
      const va = a[sortKey], vb = b[sortKey]
      // Missing values always sink to the bottom, regardless of direction.
      if (isEmpty(va) && isEmpty(vb)) return 0
      if (isEmpty(va)) return 1
      if (isEmpty(vb)) return -1
      if (isNum(va) && isNum(vb)) return (va - vb) * dir
      return String(va).localeCompare(String(vb)) * dir
    })
  }, [products, sortKey, sortDir])

  const toggleSort = (col) => {
    if (!col.sortable) return
    if (sortKey === col.key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(col.key); setSortDir('asc') }
  }
  const toggleOpen = (id) => setOpenId((cur) => (cur === id ? null : id))
  const ariaSort = (col) =>
    sortKey === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'

  return (
    <section className="compare" aria-label="Comparison table">
      <table className="compare__table">
        <thead>
          <tr>
            <th className="compare__th" scope="col">Product</th>
            {columns.map((col) => (
              <th key={col.key} scope="col" aria-sort={col.sortable ? ariaSort(col) : undefined}
                  className={`compare__th${col.sortable ? ' compare__th--sortable' : ''}`}>
                {col.sortable ? (
                  <button type="button" className="compare__sortbtn" onClick={() => toggleSort(col)}>
                    {col.label}
                    <span aria-hidden="true">
                      {sortKey === col.key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ' ↕'}
                    </span>
                  </button>
                ) : col.label}
              </th>
            ))}
            <th className="compare__th" scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((p) => {
            const open = openId === p.id
            return (
              <Fragment key={p.id}>
                <tr className={`compare__row${p.highlight ? ' compare__row--best' : ''}`}>
                  <td className="compare__product">
                    <img src={p.image} alt={p.name} className="compare__img"
                         width="54" height="54" loading="lazy" decoding="async" />
                    <div>
                      <button type="button" className="compare__name compare__namebtn"
                              aria-expanded={open} onClick={() => toggleOpen(p.id)}>
                        {p.name}
                        <span className="compare__chevron" aria-hidden="true">{open ? '▲' : '▼'}</span>
                      </button>
                      {p.badge && <span className="badge" style={{ marginLeft: 8 }}>{p.badge}</span>}
                    </div>
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} data-label={col.label} className="compare__cell">
                      {formatCell(p, col)}
                    </td>
                  ))}
                  <td className="compare__cta"><Buy url={p.amazonUrl} /></td>
                </tr>
                {open && (
                  <tr><td colSpan={columns.length + 2}><Detail product={p} /></td></tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>

      <div className="compare__cards">
        {sorted.map((p) => {
          const open = openId === p.id
          return (
            <article key={p.id} className={`mcard${p.highlight ? ' mcard--best' : ''}`}>
              <div className="mcard__head">
                <img src={p.image} alt={p.name} className="mcard__img"
                     width="56" height="56" loading="lazy" decoding="async" />
                <div>
                  <p className="mcard__name">
                    <button type="button" className="compare__namebtn"
                            aria-expanded={open} onClick={() => toggleOpen(p.id)}>
                      {p.name}
                      <span className="compare__chevron" aria-hidden="true">{open ? '▲' : '▼'}</span>
                    </button>
                  </p>
                  {p.badge && <span className="badge">{p.badge}</span>}
                </div>
              </div>
              <dl className="mcard__specs">
                {columns.map((col) => (
                  <div key={col.key} className="mcard__spec">
                    <dt>{col.label}</dt><dd>{formatCell(p, col)}</dd>
                  </div>
                ))}
              </dl>
              <Buy url={p.amazonUrl} />
              {open && <Detail product={p} />}
            </article>
          )
        })}
      </div>
    </section>
  )
}
