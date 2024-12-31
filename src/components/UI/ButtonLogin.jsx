import React from 'react'

export default function ButtonLogin({children, className, ...props}) {
  return (
    <button className={`${className} bg-red-500 hover:bg-red-700 py-2 text-white`} {...props}>{children}</button>
  )
}
