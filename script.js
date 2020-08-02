const quoteContainer = document.getElementById('quote-container');
const quoteTextContainer = document.getElementById('quote-text');
const quoteText = document.getElementById('quote');
const authorTextContainer = document.getElementById('quote-author');
const authorText = document.getElementById('author');
const btnContainer = document.getElementById('button-container');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const errorMsg = document.getElementById('error-message');
const loader = document.getElementById('loader');

const proxyUrl = 'https://peaceful-plains-68186.herokuapp.com/';
const apiUrl =
  'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
const maxErrorsAllowed = 10;

let errorCount = 0;

function showLoadingSpinner() {
  loader.hidden = false;
  quoteContainer.hidden = true;
}

function hideLoadingSpinner() {
  if (!loader.hidden) {
    loader.hidden = true;
    quoteContainer.hidden = false;
  }
}

function showErrorMessage() {
  // hide quote & author and show error message
  errorMsg.hidden = false;
  quoteTextContainer.hidden = true;
  authorTextContainer.hidden = true;

  // show twitter button and push 'New Quote' button to the end
  twitterBtn.hidden = true;
  btnContainer.style.justifyContent = 'flex-end';
}

function hideErrorMessage() {
  // hide error message and show quote & author
  errorMsg.hidden = true;
  quoteTextContainer.hidden = false;
  authorTextContainer.hidden = false;

  // show twitter button and add spaces between buttons
  twitterBtn.hidden = false;
  btnContainer.style.justifyContent = 'space-between';
}

async function getQuote() {
  // if error message is displayed then hide error message and reset error count
  if (!errorMsg.hidden && errorCount >= maxErrorsAllowed) {
    errorCount = 0;
    hideErrorMessage();
  }

  showLoadingSpinner();

  try {
    const response = await fetch(proxyUrl + apiUrl);
    const data = await response.json();

    // if new quote is same as current quote, get new quote again
    if (data.quoteText === quoteText.innerText) {
      getQuote();
    } else {
      quoteText.innerText = data.quoteText;

      // if author is blank, add 'Unknown'
      authorText.innerText =
        data.quoteAuthor === '' ? 'Unknown' : data.quoteAuthor;

      // reduce font size for long quotes
      if (data.quoteText.length > 120) {
        quoteText.classList.add('long-quote');
      } else {
        quoteText.classList.remove('long-quote');
      }

      // once data is set into containers, hide loader and scroll to top
      hideLoadingSpinner();
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
      
      // reset error count
      errorCount = 0;
    }
  } catch (error) {
    if (errorCount < maxErrorsAllowed) {
      // if error is encountered, increase error count and retry fetching quote
      ++errorCount;
      getQuote();
    } else {
      // if max number of errors are encountered, hide loader and show error message
      hideLoadingSpinner();
      showErrorMessage();
    }
  }
}

function tweetQuote() {
  const quote = quoteText.innerText;
  const author = authorText.innerText;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
  window.open(twitterUrl, '_blank');
}

// Event Listeners
newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);

// On Load
hideErrorMessage();
getQuote();
