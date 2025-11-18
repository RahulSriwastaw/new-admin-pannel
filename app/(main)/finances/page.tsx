                  <div className="flex justify-between">
                    <span className="text-[#A0C4B5]">Platform Fee</span>
                    <span>₹{selectedWithdrawal.platformFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A0C4B5]">TDS</span>
                    <span>₹{selectedWithdrawal.tds.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-[#15362B] pt-2">
                    <span>Net Payable</span>
                    <span>₹{selectedWithdrawal.netPayable.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#112C23] rounded-xl p-4">
                <h3 className="font-medium mb-4">Bank Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[#A0C4B5] text-sm">Account Holder</p>
                    <p>{selectedWithdrawal.bankDetails.accountHolder}</p>
                  </div>
                  <div>
                    <p className="text-[#A0C4B5] text-sm">Bank Name</p>
                    <p>{selectedWithdrawal.bankDetails.bankName}</p>
                  </div>
                  <div>
                    <p className="text-[#A0C4B5] text-sm">Account Number</p>
                    <p>{selectedWithdrawal.bankDetails.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-[#A0C4B5] text-sm">IFSC Code</p>
                    <p>{selectedWithdrawal.bankDetails.ifsc}</p>
                  </div>
                  <div>
                    <p className="text-[#A0C4B5] text-sm">PAN Number</p>
                    <p>{selectedWithdrawal.bankDetails.pan}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowWithdrawalDetail(false)}
                  className="px-4 py-2 bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors"
                >
                  Close
                </button>
                {selectedWithdrawal.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        setShowWithdrawalDetail(false)
                        handleApproveWithdrawal(selectedWithdrawal.id)
                      }}
                      className="px-4 py-2 bg-green-900/50 hover:bg-green-900/70 text-green-400 rounded-lg transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setShowWithdrawalDetail(false)
                        handleRejectWithdrawal(selectedWithdrawal.id)
                      }}
                      className="px-4 py-2 bg-red-900/50 hover:bg-red-900/70 text-red-400 rounded-lg transition-colors"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ title, value, change, icon }: { 
  title: string, 
  value: string, 
  change: string, 
  icon: React.ReactNode 
}) {
  return (
    <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm hover:border-[#4EFF9B]/40 transition-all">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[#A0C4B5] text-sm mb-1">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          <p className="text-[#4EFF9B] text-sm mt-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            {change}
          </p>
        </div>
        <div className="p-3 bg-[#112C23] rounded-xl text-[#4EFF9B]">
          {icon}
        </div>
      </div>
    </div>
  )
}

export default FinancesPage