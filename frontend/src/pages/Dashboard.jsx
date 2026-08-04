import React from 'react'

const Dashboard = () => {
  return (
    <div className='rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900'>
      <p className='text-sm font-semibold text-slate-500 dark:text-slate-400'>Overview</p>
      <h2 className='mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100'>Dashboard</h2>
      <p className='mt-2 text-slate-600 dark:text-slate-300'>Your portfolio summary will appear here.</p>
    </div>
  )
}

export default Dashboard
