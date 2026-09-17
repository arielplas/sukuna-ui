import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { tableStyles } from './table.styles'

const styles = tableStyles()

/** Table root — a scroll-wrapped `<table>`. Static and RSC-safe (no `'use client'`). */
const TableRoot = forwardRef<HTMLTableElement, ComponentPropsWithoutRef<'table'>>(function Table(
  { className, children, ...rest },
  ref,
) {
  return (
    <div className={styles.wrapper()}>
      <table ref={ref} className={styles.table({ className })} {...rest}>
        {children}
      </table>
    </div>
  )
})

function Header({ className, ...rest }: ComponentPropsWithoutRef<'thead'>) {
  return <thead className={styles.header({ className })} {...rest} />
}
function Body({ className, ...rest }: ComponentPropsWithoutRef<'tbody'>) {
  return <tbody className={styles.body({ className })} {...rest} />
}
function Row({ className, ...rest }: ComponentPropsWithoutRef<'tr'>) {
  return <tr className={styles.row({ className })} {...rest} />
}
function HeaderCell({ className, ...rest }: ComponentPropsWithoutRef<'th'>) {
  return <th className={styles.headerCell({ className })} {...rest} />
}
function Cell({ className, ...rest }: ComponentPropsWithoutRef<'td'>) {
  return <td className={styles.cell({ className })} {...rest} />
}

export type TableProps = ComponentPropsWithoutRef<'table'>

/** Compound: `Table` + `Table.Header/Body/Row/HeaderCell/Cell`. */
export const Table = Object.assign(TableRoot, { Header, Body, Row, HeaderCell, Cell })
