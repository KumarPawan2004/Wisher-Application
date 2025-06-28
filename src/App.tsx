import  { useState, useEffect } from 'react';
import { Gift, Heart, Sparkles, Send, PartyPopper } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState<'create' | 'receive'>('create');
  const [wishMessage, setWishMessage] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [shareableLink, setShareableLink] = useState('');
  const [showWish, setShowWish] = useState(false);
  const [confetti, setConfetti] = useState(false);

  // Check URL parameters on load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedWish = urlParams.get('wish');
    const encodedRecipient = urlParams.get('to');
    const encodedSender = urlParams.get('from');

    if (encodedWish && encodedRecipient && encodedSender) {
      setWishMessage(decodeURIComponent(encodedWish));
      setRecipientName(decodeURIComponent(encodedRecipient));
      setSenderName(decodeURIComponent(encodedSender));
      setCurrentView('receive');
    }
  }, []);

  const generateShareableLink = () => {
    if (!wishMessage.trim() || !recipientName.trim() || !senderName.trim()) {
      alert('Please fill in all fields!');
      return;
    }

    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams({
      wish: encodeURIComponent(wishMessage),
      to: encodeURIComponent(recipientName),
      from: encodeURIComponent(senderName)
    });
    
    const link = `${baseUrl}?${params.toString()}`;
    setShareableLink(link);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      alert('Link copied to clipboard!');
    } catch (err) {
      alert('Failed to copy link. Please copy it manually.');
    }
  };

  const revealWish = () => {
    setShowWish(true);
    setConfetti(true);
    setTimeout(() => setConfetti(false), 3000);
  };

  const resetToCreate = () => {
    setCurrentView('create');
    setWishMessage('');
    setRecipientName('');
    setSenderName('');
    setShareableLink('');
    setShowWish(false);
    setConfetti(false);
    window.history.pushState({}, '', window.location.pathname);
  };

  if (currentView === 'receive') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-pink-300 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 left-32 w-12 h-12 bg-blue-300 rounded-full opacity-25 animate-bounce delay-1000"></div>
          <div className="absolute bottom-40 right-10 w-24 h-24 bg-green-300 rounded-full opacity-20 animate-pulse delay-500"></div>
        </div>

        {/* Confetti effect */}
        {confetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              ></div>
            ))}
          </div>
        )}

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative z-10">
          {!showWish ? (
            <div className="space-y-6">
              <div className="flex justify-center">
                <Gift className="w-16 h-16 text-purple-600 animate-bounce" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                🎉 Surprise! 🎉
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Hey <span className="font-semibold text-purple-600">{recipientName}</span>!
                <br />
                Someone special has a birthday wish for you!
              </p>
              <button
                onClick={revealWish}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-2 mx-auto"
              >
                <PartyPopper className="w-5 h-5" />
                Accept & Reveal Wish
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-center space-x-2">
                <Sparkles className="w-8 h-8 text-yellow-500 animate-spin" />
                <Heart className="w-8 h-8 text-red-500 animate-pulse" />
                <Sparkles className="w-8 h-8 text-yellow-500 animate-spin" />
              </div>
              
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                Happy Birthday! 🎂
              </h1>
              
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                <p className="text-lg text-gray-700 leading-relaxed italic">
                  "{wishMessage}"
                </p>
              </div>
              
              <p className="text-lg text-gray-600">
                With love from,<br />
                <span className="font-bold text-purple-600 text-xl">{senderName}</span> 💝
              </p>
              
              <div className="pt-4">
                <button
                  onClick={resetToCreate}
                  className="text-purple-600 hover:text-purple-800 font-medium underline"
                >
                  Create your own birthday wish
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Gift className="w-12 h-12 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🎂 Birthday Wish Creator
          </h1>
          <p className="text-gray-600">
            Create a personalized birthday surprise for someone special
          </p>
        </div>

        {!shareableLink ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Birthday Person's Name
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Enter their name"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Birthday Wish
              </label>
              <textarea
                value={wishMessage}
                onChange={(e) => setWishMessage(e.target.value)}
                placeholder="Write your heartfelt birthday message here..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
              />
            </div>

            <button
              onClick={generateShareableLink}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Generate Shareable Link
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Sparkles className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                🎉 Link Created!
              </h2>
              <p className="text-gray-600 mb-6">
                Share this link with <span className="font-semibold">{recipientName}</span> to deliver your birthday surprise!
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border-2 border-dashed border-gray-300">
              <p className="text-sm text-gray-600 mb-2">Shareable Link:</p>
              <div className="bg-white rounded-lg p-3 border break-all text-sm text-gray-800">
                {shareableLink}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={copyToClipboard}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200"
              >
                Copy Link
              </button>
              <button
                onClick={() => setShareableLink('')}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200"
              >
                Create Another
              </button>
            </div>

            <div className="text-center pt-4">
              <p className="text-sm text-gray-500">
                💡 Tip: The recipient will see a surprise button before revealing your wish!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;