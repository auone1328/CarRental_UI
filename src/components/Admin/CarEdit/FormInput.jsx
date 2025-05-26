import React from "react"

export default function FormInput( {inpuId, type, placeHolder, value, setValue, isDisabled = false} ){

    return (
        <div className="m-2">
            <label htmlFor={inpuId} className="sr-only">
                {placeHolder}
            </label>
            <input
                id={inpuId}
                name={inpuId}
                type={type} 
                disabled={isDisabled ? "disabled" : ""}
                required
                className={`${isDisabled ? "text-gray-400" : ""} rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 rounded-xl focus:outline-none! focus:ring-red-500! focus:border-red-500! focus:z-10!`}
                placeholder={placeHolder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />                                           
        </div>
    )
}