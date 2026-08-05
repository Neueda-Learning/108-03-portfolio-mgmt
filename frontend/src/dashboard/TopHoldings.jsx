import { useMemo } from "react";

function TopHoldings({ data = [], onAddAsset }) {
  const formatCurrency = (value) => {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) return value;
    return `₹${numeric.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
  };

  const formatNumber = (value) => {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) return value;
    return numeric.toLocaleString();
  };

  const topHoldings = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return [...data]
      .sort(
        (a, b) =>
          Number(b?.marketValue ?? 0) - Number(a?.marketValue ?? 0)
      )
      .slice(0, 5);
  }, [data]);

  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">Top holdings</h3>
        <button
          type="button"
          onClick={onAddAsset}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Add Asset
        </button>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-[900px] w-full border-separate border-spacing-0">
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
            </tr>
          </thead>
          <tbody>
            {topHoldings.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-3 py-8 text-center text-sm text-slate-500"
                >
                  No holdings data available.
                </td>
              </tr>
            ) : (
              topHoldings.map((item, index) => {
                const pl = Number(item.profitLoss);
                const plClass = Number.isNaN(pl)
                  ? "text-slate-700"
                  : pl >= 0
                    ? "text-emerald-600"
                    : "text-rose-600";
                return (
                  <tr
                    key={`${item.asset}-${index}`}
                    className="transition-colors duration-150 hover:bg-slate-50"
                  >
                    <td className="border-b border-slate-100 px-3 py-3.5 text-sm font-semibold text-slate-900">
                      {item.asset}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-3.5 text-sm text-slate-700">
                      {item.type}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-3.5 text-right text-sm text-slate-700">
                      {formatNumber(item.quantity)}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-3.5 text-right text-sm text-slate-700">
                      {formatCurrency(item.buyPrice)}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-3.5 text-right text-sm text-slate-700">
                      {formatCurrency(item.currentPrice)}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-3.5 text-right text-sm font-semibold text-slate-900">
                      {formatCurrency(item.marketValue)}
                    </td>
                    <td
                      className={`border-b border-slate-100 px-3 py-3.5 text-right text-sm font-semibold ${plClass}`}
                    >
                      {formatCurrency(item.profitLoss)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default TopHoldings;
