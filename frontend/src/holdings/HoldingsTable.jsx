import HoldingRow from './HoldingRow'

function HoldingsTable({ data = [], onDelete, isLoading = false }) {

	return (
		<section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
			<div className="overflow-x-auto">
				<table className="min-w-[1100px] w-full border-separate border-spacing-0">
					<thead>
						<tr>
							<th className="border-b border-slate-200 px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
								Asset
							</th>
							<th className="border-b border-slate-200 px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
								Type
							</th>
							<th className="border-b border-slate-200 px-3 py-3 text-right text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
								Quantity
							</th>
							<th className="border-b border-slate-200 px-3 py-3 text-right text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
								Buy Price
							</th>
							<th className="border-b border-slate-200 px-3 py-3 text-right text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
								Current Price
							</th>
							<th className="border-b border-slate-200 px-3 py-3 text-right text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
								Market Value
							</th>
							<th className="border-b border-slate-200 px-3 py-3 text-right text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
								Profit/Loss
							</th>
							<th className="border-b border-slate-200 px-3 py-3 text-right text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
								Purchase Date
							</th>
							<th className="border-b border-slate-200 px-3 py-3 text-right text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
								Action
							</th>
						</tr>
					</thead>

					<tbody>
						{isLoading ? (
							<tr>
								<td colSpan={9} className="px-3 py-8 text-center text-sm text-slate-500">
									Loading holdings...
								</td>
							</tr>
						) : data.length === 0 ? (
							<tr>
								<td colSpan={9} className="px-3 py-8 text-center text-sm text-slate-500">
									No holdings found.
								</td>
							</tr>
						) : (
							data.map((item, index) => (
								<HoldingRow key={item.id ?? `${item.asset}-${index}`} holding={item} onDelete={onDelete} />
							))
						)}
					</tbody>
				</table>
			</div>
		</section>
	)
}

export default HoldingsTable
