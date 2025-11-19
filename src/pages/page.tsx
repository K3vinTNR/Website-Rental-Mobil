
import { useState, useEffect } from 'react'
import { supabase } from "../integrations_supabase/client";
import { ChevronRight, Car, Loader } from 'lucide-react';

type Item = { id: string; merek: string; model: string }

function Page() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getItems() {
      setLoading(true)
      const { data, error } = await supabase
        .from('mobil')
        .select('id_mobil, merek, model')

      if (error) {
        console.error('Supabase error fetching mobil:', error)
        setLoading(false)
        return
      }

      if (!data) {
        setLoading(false)
        return
      }

      const mapped: Item[] = (data as any[]).map((d) => ({
        id: d.id_mobil,
        merek: d.merek,
        model: d.model,
      }))

      setItems(mapped)
      setLoading(false)
    }

    getItems()
  }, [])

  const colorGradients = [
    'from-blue-500 to-cyan-400',
    'from-purple-500 to-pink-400',
    'from-orange-500 to-red-400',
    'from-green-500 to-teal-400',
    'from-indigo-500 to-blue-400',
    'from-red-500 to-orange-400',
  ]

  const getBrandGradient = (index: number) => colorGradients[index % colorGradients.length]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="relative overflow-hidden px-6 pt-12 pb-16">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Premium Fleet</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-3">
            Discover Our Fleet
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl">
            Explore our exclusive collection of premium vehicles. Book your dream car today.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
              >
                <div className="h-40 bg-gradient-to-r from-gray-200 to-gray-300" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-gray-200 rounded-lg w-3/4" />
                  <div className="h-4 bg-gray-200 rounded-lg w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mb-4">
              <Car className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Vehicles Available</h3>
            <p className="text-gray-600">Check back soon for our premium collection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <article
                key={item.id}
                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden hover:scale-105 cursor-pointer transform"
              >
                {/* Image Section */}
                <div className={`relative h-48 bg-gradient-to-br ${getBrandGradient(index)} overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Car className="w-16 h-16 text-white/80 mx-auto mb-2" />
                      <p className="text-white font-semibold text-lg opacity-90">{item.merek}</p>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-semibold">
                    Premium
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all mb-2">
                    {item.merek} {item.model}
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" />
                    <span className="text-xs text-gray-500 font-mono">{item.id}</span>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    <div className="text-sm text-gray-600">✓ Full insurance coverage</div>
                    <div className="text-sm text-gray-600">✓ 24/7 roadside assistance</div>
                    <div className="text-sm text-gray-600">✓ Free cancellation</div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                      View Details
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <button className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300">
                      Book Now
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Page
