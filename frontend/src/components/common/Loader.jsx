import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown } from '@fortawesome/free-solid-svg-icons'

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="animate-spin">
        <FontAwesomeIcon icon={faCrown} className="text-5xl text-gold-600" />
      </div>
      <p className="mt-4 text-black-600 font-medium">Loading...</p>
    </div>
  )
}

export default Loader