function Loader({
	text = 'Loading...',
	className = '',
	fullHeight = true,
}) {
	return (
		<div
			className={[
				'w-full flex items-center justify-center px-4',
				fullHeight ? 'min-h-screen' : 'min-h-[260px]',
				className,
			].join(' ')}
			role="status"
			aria-live="polite"
		>
			<div className="rounded-2xl border border-slate-200 bg-white/90 px-8 py-7 text-center shadow-[0_16px_34px_-22px_rgba(15,23,42,0.45)] backdrop-blur-sm">
				<div className="mx-auto h-12 w-12 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />
				<p className="mt-4 text-sm font-semibold tracking-[0.08em] text-slate-600">
					{text}
				</p>
			</div>
		</div>
	)
}

export default Loader
