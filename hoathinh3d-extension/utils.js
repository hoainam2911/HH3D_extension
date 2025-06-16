function fuzzyMatch(str1, str2, threshold = 0.75) {
  // So sánh trực tiếp str1 và str2 mà không chuẩn hóa
  if (str1 === str2) {
    console.log(`[FuzzyMatch] Exact match: "${str1}" == "${str2}"`);
    return 1;
  }

  const len1 = str1.length;
  const len2 = str2.length;
  const matrix = Array(len2 + 1)
    .fill()
    .map(() => Array(len1 + 1).fill(0));

  for (let i = 0; i <= len1; i++) matrix[0][i] = i;
  for (let j = 0; j <= len2; j++) matrix[j][0] = j;

  for (let j = 1; j <= len2; j++) {
    for (let i = 1; i <= len1; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }

  const distance = matrix[len2][len1];
  const maxLen = Math.max(len1, len2);
  const similarity = 1 - distance / maxLen;
  console.log(`[FuzzyMatch] Comparing "${str1}" vs "${str2}", Similarity: ${similarity.toFixed(2)}`);
  return similarity >= threshold ? similarity : 0;
}

function waitForElement(selector, callback, timeout = 5000, retries = 3) {
  let attempts = 0;
  const startTime = Date.now();
  const interval = setInterval(() => {
    const element = document.querySelector(selector);
    if (element) {
      clearInterval(interval);
      console.log(`[WaitForElement] Found "${selector}" after ${attempts + 1} attempts`);
      callback(element);
    } else if (Date.now() - startTime > timeout) {
      attempts++;
      if (attempts >= retries) {
        clearInterval(interval);
        console.error(`[WaitForElement] Failed to find "${selector}" after ${retries} retries`);
      } else {
        console.log(`[WaitForElement] Retry ${attempts}/${retries} for "${selector}"`);
      }
    }
  }, 100);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}