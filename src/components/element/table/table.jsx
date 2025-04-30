import React from 'react'

export const Table = ({arrayProducts, pay}) => {
  return (
    <div className="relative overflow-x-auto">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="px-6 py-3">
            nombre
          </th>
          <th scope="col" className="px-6 py-3">
            Descripcion
          </th>
          <th scope="col" className="px-6 py-3">
            Precio
          </th>
          <th scope="col" className="px-6 py-3">
            Stock disponible
          </th>
          <th scope="col" className="px-6 py-3">
            Acción
          </th>
        </tr>
      </thead>
      <tbody>
        {arrayProducts.map((item, index) => (
          <tr
            key={index}
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
          >
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              {item.name}
            </th>
            <td className="px-6 py-4">{item.description}</td>
            <td className="px-6 py-4">{item.price}</td>
            <td className="px-6 py-4">{item.stock}-Unidades</td>
            <td className="px-6 py-4">
              <button
                className="border border-slate-400 p-3 rounded-full bg-slate-300"
                onClick={() => pay(item)}
              >
                Pagar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  )
}
