document.getElementById("save").addEventListener("click", () => {
  let domainInput = document.getElementById("domain").value.trim()
  const status = document.getElementById("status")
  const error = document.getElementById("error")
  const saveBtn = document.getElementById("save")

  status.textContent = ""
  error.textContent = ""

  // Add loading state
  saveBtn.classList.add("loading")
  saveBtn.disabled = true

  const urlPattern = /^https:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\//

  setTimeout(() => {
    try {
      const url = new URL(domainInput)
      domainInput = `${url.protocol}//${url.hostname}/`
      console.log(`[Popup] Parsed domain: ${domainInput}`)
    } catch (e) {
      error.textContent = "Domain không hợp lệ! Vui lòng nhập URL đúng định dạng."
      saveBtn.classList.remove("loading")
      saveBtn.disabled = false
      return
    }

    if (!urlPattern.test(domainInput)) {
      error.textContent = "Domain không hợp lệ! Vui lòng nhập URL đúng định dạng."
      saveBtn.classList.remove("loading")
      saveBtn.disabled = false
      return
    }

    chrome.storage.sync.set({ hoathinh3dDomain: domainInput }, () => {
      status.textContent = "✅ Lưu domain thành công!"
      saveBtn.classList.remove("loading")
      saveBtn.disabled = false

      setTimeout(() => {
        status.textContent = ""
      }, 3000)
    })
  }, 800) // Simulate loading time
})

const qrContainer = document.getElementById("qr-container")
const qrImage = document.getElementById("qr-image")
let isQrVisible = false
let currentQr = null

document.getElementById("contact").addEventListener("click", () => {
  if (isQrVisible && currentQr === "zalo") {
    qrContainer.style.display = "none"
    isQrVisible = false
    currentQr = null
  } else {
    qrImage.src = "zalo.png"
    qrContainer.style.display = "block"
    isQrVisible = true
    currentQr = "zalo"

    // Hide other QR if visible
    if (currentQr !== "zalo") {
      qrContainer.style.display = "none"
      setTimeout(() => {
        qrContainer.style.display = "block"
      }, 100)
    }
  }
})

document.getElementById("donate").addEventListener("click", () => {
  if (isQrVisible && currentQr === "momo") {
    qrContainer.style.display = "none"
    isQrVisible = false
    currentQr = null
  } else {
    qrImage.src = "momo.png"
    qrContainer.style.display = "block"
    isQrVisible = true
    currentQr = "momo"

    // Hide other QR if visible
    if (currentQr !== "momo") {
      qrContainer.style.display = "none"
      setTimeout(() => {
        qrContainer.style.display = "block"
      }, 100)
    }
  }
})

// Function button handlers with enhanced feedback
const functionButtons = ["navGroup1", "navGroup2", "navBangHoatDong", "navDoThach", "navHoangVuc", "navKhoangMach"]

functionButtons.forEach((buttonId) => {
  document.getElementById(buttonId).addEventListener("click", (e) => {
    const button = e.target
    button.style.transform = "scale(0.95)"

    setTimeout(() => {
      button.style.transform = ""
    }, 150)

    chrome.storage.sync.get(["hoathinh3dDomain"], (result) => {
      const domain = result.hoathinh3dDomain || "https://hoathinh3d.gg/"

      switch (buttonId) {
        case "navGroup1":
          chrome.tabs.create({ url: domain + "phuc-loi-duong" })
          chrome.tabs.create({ url: domain + "thi-luyen-tong-mon-hh3d" })
          chrome.tabs.create({ url: domain + "bi-canh-tong-mon" })
          break
        case "navGroup2":
          chrome.tabs.create({ url: domain + "van-dap-tong-mon" })
          chrome.tabs.create({ url: domain + "diem-danh" })
          chrome.tabs.create({ url: domain + "luan-vo-duong" })
          chrome.tabs.create({ url: domain + "danh-sach-thanh-vien-tong-mon" })
          break
        case "navBangHoatDong":
          chrome.tabs.create({ url: domain + "bang-hoat-dong-ngay" })
          break
        case "navDoThach":
          chrome.tabs.create({ url: domain + "do-thach-hh3d" })
          break
        case "navHoangVuc":
          // Hiển thị popup lựa chọn chiến thuật
          showHoangVucOptions(domain)
          break
        case "navKhoangMach":
          // Hiển thị popup lựa chọn loại mỏ
          showKhoangMachOptions(domain)
          break
      }
    })
  })
})

// Load saved domain on popup open
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(["hoathinh3dDomain"], (result) => {
    if (result.hoathinh3dDomain) {
      document.getElementById("domain").value = result.hoathinh3dDomain
    }
  })
})

// Add click effects to contact buttons
document.getElementById("contact").addEventListener("click", (e) => {
  const button = e.target
  button.style.transform = "scale(0.95)"
  setTimeout(() => {
    button.style.transform = ""
  }, 150)
})

document.getElementById("donate").addEventListener("click", (e) => {
  const button = e.target
  button.style.transform = "scale(0.95)"
  setTimeout(() => {
    button.style.transform = ""
  }, 150)
})

function showHoangVucOptions(domain) {
  // Tạo popup lựa chọn chiến thuật
  const popup = document.createElement("div")
  popup.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center;">
      <div style="background: white; padding: 20px; border-radius: 12px; max-width: 300px; text-align: center;">
        <h3 style="margin-bottom: 15px; color: #333;">⚔️ Chiến Thuật Hoang Vực</h3>
        <p style="font-size: 12px; color: #666; margin-bottom: 20px;">Chọn chiến thuật reset linh căn:</p>
        
        <button id="strategy-none" style="width: 100%; margin: 5px 0; padding: 10px; border: none; border-radius: 8px; background: #e2e8f0; color: #4a5568; cursor: pointer;">
          🚫 Không Reset Linh Căn
        </button>
        
        <button id="strategy-avoid" style="width: 100%; margin: 5px 0; padding: 10px; border: none; border-radius: 8px; background: #fed7d7; color: #c53030; cursor: pointer;">
          🛡️ Reset Tránh Bị Trừ 15%
        </button>
        
        <button id="strategy-buff" style="width: 100%; margin: 5px 0; padding: 10px; border: none; border-radius: 8px; background: #c6f6d5; color: #2f855a; cursor: pointer;">
          ⚡ Reset Để Được Cộng 15%
        </button>
        
        <button id="cancel-strategy" style="width: 100%; margin: 10px 0 0 0; padding: 8px; border: none; border-radius: 8px; background: #a0aec0; color: white; cursor: pointer;">
          Hủy
        </button>
      </div>
    </div>
  `

  document.body.appendChild(popup)

  // Xử lý sự kiện click
  document.getElementById("strategy-none").onclick = () => {
    chrome.storage.sync.set({ hoangVucStrategy: "none" })
    chrome.tabs.create({ url: domain + "hoang-vuc" })
    document.body.removeChild(popup)
  }

  document.getElementById("strategy-avoid").onclick = () => {
    chrome.storage.sync.set({ hoangVucStrategy: "avoid" })
    chrome.tabs.create({ url: domain + "hoang-vuc" })
    document.body.removeChild(popup)
  }

  document.getElementById("strategy-buff").onclick = () => {
    chrome.storage.sync.set({ hoangVucStrategy: "buff" })
    chrome.tabs.create({ url: domain + "hoang-vuc" })
    document.body.removeChild(popup)
  }

  document.getElementById("cancel-strategy").onclick = () => {
    document.body.removeChild(popup)
  }
}

// Thay thế function showKhoangMachOptions bằng function đơn giản hơn
function showKhoangMachOptions(domain) {
  // Tạo popup nhập ID mỏ
  const popup = document.createElement("div")
  popup.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center;">
      <div style="background: white; padding: 20px; border-radius: 12px; max-width: 350px; text-align: center;">
        <h3 style="margin-bottom: 15px; color: #333;">⛏️ Nhập ID Khoáng Mạch</h3>
        <p style="font-size: 12px; color: #666; margin-bottom: 15px;">Nhập ID mỏ để tự động vào:</p>
        
        <input type="number" id="mine-id-input" placeholder="Ví dụ: 64, 70, 51..." style="
          width: 100%; 
          padding: 12px; 
          border: 2px solid #e2e8f0; 
          border-radius: 8px; 
          font-size: 14px; 
          margin-bottom: 15px;
          text-align: center;
        ">
        
        <div style="font-size: 11px; color: #718096; margin-bottom: 15px; text-align: left;">
          <strong>Mỏ Thượng:</strong> 51, 52, 53, 54, 55, 56, 64, 73<br>
          <strong>Mỏ Trung:</strong> 70, 32, 47, 35, 59, 67, 66, 44, 31, 46, 50, 42, 68, 37, 43, 74, 75, 65, 49, 72, 48, 39, 33, 40, 38, 36, 58, 34, 60, 57, 45, 41, 71, 62, 69, 61
        </div>
        
        <button id="confirm-mine-id" style="width: 100%; margin: 5px 0; padding: 12px; border: none; border-radius: 8px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; cursor: pointer; font-weight: 600;">
          ✅ Xác Nhận & Vào Mỏ
        </button>
        
        <button id="cancel-mine-id" style="width: 100%; margin: 5px 0; padding: 10px; border: none; border-radius: 8px; background: #a0aec0; color: white; cursor: pointer;">
          Hủy
        </button>
      </div>
    </div>
  `

  document.body.appendChild(popup)

  // Xử lý sự kiện
  document.getElementById("confirm-mine-id").onclick = () => {
    const mineId = document.getElementById("mine-id-input").value.trim()

    if (!mineId) {
      alert("Vui lòng nhập ID mỏ!")
      return
    }

    // Lưu ID mỏ đã chọn
    chrome.storage.sync.set({ khoangMachSelectedId: mineId })

    // Mở tab khoáng mạch
    chrome.tabs.create({ url: domain + "khoang-mach" })

    document.body.removeChild(popup)
  }

  document.getElementById("cancel-mine-id").onclick = () => {
    document.body.removeChild(popup)
  }

  // Focus vào input
  setTimeout(() => {
    document.getElementById("mine-id-input").focus()
  }, 100)
}

// Xóa function showMineSelection vì không cần nữa
