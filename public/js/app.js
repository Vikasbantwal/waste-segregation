// public/js/app.js
let net;
const photoInput = document.getElementById("photoInput");
const preview = document.getElementById("preview");
const classifyBtn = document.getElementById("classifyBtn");
const resultEl = document.getElementById("result");
const resellEl = document.getElementById("resell");
const logoutBtn = document.getElementById("logoutBtn");

let selectedFile = null;

// load mobilenet
(async function() {
  resultEl.innerText = "Loading model...";
  net = await mobilenet.load();
  resultEl.innerText = "Model loaded. Choose an image.";
})();

photoInput.addEventListener("change", (ev) => {
  const file = ev.target.files[0];
  if (!file) return;
  selectedFile = file;
  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);
  img.onload = () => URL.revokeObjectURL(img.src);
  preview.innerHTML = "";
  preview.appendChild(img);
  classifyBtn.disabled = false;
  resellEl.innerHTML = "";
  resultEl.innerText = "";
});

classifyBtn.addEventListener("click", async () => {
  if (!selectedFile || !net) return;
  // create image element for mobilenet
  const imgEl = preview.querySelector("img");
  resultEl.innerText = "Classifying image...";
  const predictions = await net.classify(imgEl);
  console.log(predictions);
  const top = predictions[0];
  resultEl.innerText = `Prediction: ${top.className} (prob ${top.probability.toFixed(2)})`;

  // decide if label is e-waste / electronics-like: basic keyword matching
  const label = top.className.toLowerCase();
  const eKeywords = ["laptop","computer","mobile","cell phone","phone","monitor","television","television remote","keyboard","mouse","projector","console","joystick","tv","printer","router","router","modem","camera"];
  const isE = eKeywords.some(k => label.includes(k));

  // if predicted as electronic-like, show resell suggestions
  if (isE) {
    resellEl.innerHTML = `
      <p>Looks like electronic/recyclable e-waste. You can try reselling on:</p>
      <a target="_blank" href="https://www.olx.in/items/q-${encodeURIComponent(top.className)}">Resell on OLX (search)</a>
    `;
  } else {
    resellEl.innerHTML = `<p>Not recognized as e-waste from MobileNet's top label. Consider manual sorting or specialized classifier.</p>`;
  }

  // Upload file + prediction to server
  const fd = new FormData();
  fd.append("photo", selectedFile);
  fd.append("prediction", top.className);

  const resp = await fetch("/api/upload", { method: "POST", body: fd });
  if (resp.ok) {
    const data = await resp.json();
    console.log("Saved:", data);
  } else {
    console.error("Upload failed");
  }
});

// logout
logoutBtn?.addEventListener("click", async () => {
  await fetch("/api/logout");
  location.href = "/";
});
