import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import HoldingRow from './HoldingRow'

function HoldingsTable({ holdings = [], isLoading = false, onDelete, onEditClick }) {

	return (
		<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
			<div className="overflow-x-auto">
				<table className="min-w-full">
					<thead>
						<tr>
							<th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Asset</th>
							<th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Type</th>
							<th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Quantity</th>
							<th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Buy Price</th>
							<th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Current Price</th>
							<th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Market Value</th>
							<th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">P/L</th>
							<th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Edit</th>
							<th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Delete</th>
						</tr>
					</thead>

					<tbody>
						{isLoading ? (
							<tr>
								<td colSpan={9} className="px-3 py-8 text-center text-sm text-slate-500">
									Loading holdings...
								</td>
							</tr>
						) : holdings.length === 0 ? (
							<tr>
								<td colSpan={9} className="px-3 py-8 text-center text-sm text-slate-500">
									No holdings found.
								</td>
							</tr>
						) : (
							holdings.map((holding) => (
								<HoldingRow
									key={holding?.holdingId ?? holding?.id}
									holding={holding}
									onDelete={onDelete}
									onEdit={onEditClick}
								/>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default HoldingsTable
