import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faSave, 
  faTimes, 
  faStore, 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt,
  faMoneyBillWave,
  faTruck,
  faGift,
  faGlobe,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import ScrollReveal from '../common/ScrollReveal'

const Settings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Inez Collections',
    siteDescription: 'Premium fashion store',
    contactEmail: 'info@inezcollections.com',
    contactPhone: '+233 55 123 4567',
    address: '123 Fashion Avenue, Accra, Ghana',
    currency: 'GHS',
    shippingCost: '0',
    freeShippingThreshold: '200',
  })

  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setSettings({ ...settings, [name]: value })
    setSaved(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    // This would save to backend
    setTimeout(() => {
      toast.success('Settings saved successfully! 🎉')
      setLoading(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 1000)
  }

  const inputClasses = "w-full px-4 py-3 bg-[#F4F6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D6F04C]/40 focus:bg-white transition-all duration-300 text-sm border border-transparent focus:border-[#D6F04C] placeholder:text-black/30"
  const labelClasses = "block text-sm font-medium text-black/70 mb-1.5"

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Settings</h1>
          <p className="text-sm text-black/40 mt-1">Manage your store settings</p>
        </div>
        {saved && (
          <span className="flex items-center gap-2 text-green-600 text-sm font-medium bg-green-50 px-4 py-2 rounded-full">
            <FontAwesomeIcon icon={faCheckCircle} />
            Saved successfully
          </span>
        )}
      </div>

      <ScrollReveal direction="up">
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Store Information */}
            <div>
              <h2 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-[#D6F04C]/20 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faStore} className="text-[#D6F04C] text-sm" />
                </div>
                Store Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClasses}>Site Name</label>
                  <input
                    type="text"
                    name="siteName"
                    value={settings.siteName}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="Store name"
                  />
                </div>
                <div>
                  <label className={labelClasses}>Site Description</label>
                  <input
                    type="text"
                    name="siteDescription"
                    value={settings.siteDescription}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="Brief description"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-[#D6F04C]/20 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faEnvelope} className="text-[#D6F04C] text-sm" />
                </div>
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClasses}>Contact Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 text-sm" />
                    </div>
                    <input
                      type="email"
                      name="contactEmail"
                      value={settings.contactEmail}
                      onChange={handleChange}
                      className={`${inputClasses} pl-11`}
                      placeholder="info@store.com"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClasses}>Contact Phone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faPhone} className="text-gray-400 text-sm" />
                    </div>
                    <input
                      type="text"
                      name="contactPhone"
                      value={settings.contactPhone}
                      onChange={handleChange}
                      className={`${inputClasses} pl-11`}
                      placeholder="+233 XX XXX XXXX"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <label className={labelClasses}>Store Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 text-sm" />
                  </div>
                  <input
                    type="text"
                    name="address"
                    value={settings.address}
                    onChange={handleChange}
                    className={`${inputClasses} pl-11`}
                    placeholder="123 Main St, City, Country"
                  />
                </div>
              </div>
            </div>

            {/* Payment & Shipping */}
            <div>
              <h2 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-[#D6F04C]/20 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faMoneyBillWave} className="text-[#D6F04C] text-sm" />
                </div>
                Payment & Shipping
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className={labelClasses}>Currency</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faGlobe} className="text-gray-400 text-sm" />
                    </div>
                    <select
                      name="currency"
                      value={settings.currency}
                      onChange={handleChange}
                      className={`${inputClasses} pl-11 appearance-none`}
                    >
                      <option value="GHS">🇬🇭 Ghana Cedis (GHS)</option>
                      <option value="USD">🇺🇸 US Dollar (USD)</option>
                      <option value="EUR">🇪🇺 Euro (EUR)</option>
                      <option value="GBP">🇬🇧 British Pound (GBP)</option>
                      <option value="NGN">🇳🇬 Nigerian Naira (NGN)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelClasses}>
                    <span className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faTruck} className="text-[#D6F04C] text-xs" />
                      Shipping Cost
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-sm font-medium">₵</span>
                    </div>
                    <input
                      type="number"
                      name="shippingCost"
                      value={settings.shippingCost}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className={`${inputClasses} pl-9`}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClasses}>
                    <span className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faGift} className="text-[#D6F04C] text-xs" />
                      Free Shipping Threshold
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-sm font-medium">₵</span>
                    </div>
                    <input
                      type="number"
                      name="freeShippingThreshold"
                      value={settings.freeShippingThreshold}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className={`${inputClasses} pl-9`}
                      placeholder="200.00"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-3 bg-black text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-black-800 transition-all duration-300 disabled:opacity-50 group shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="text-sm" />
                    <span>Save Settings</span>
                    <span className="w-7 h-7 rounded-full bg-[#D6F04C] text-black flex items-center justify-center shrink-0 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
                      <FontAwesomeIcon icon={faTimes} className="text-xs rotate-45" />
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Preview Section */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-black/30 text-center">
              💡 Settings will be applied to your store frontend
            </p>
          </div>
        </div>
      </ScrollReveal>
    </div>
  )
}

export default Settings