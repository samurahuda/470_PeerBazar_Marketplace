<div class="flex flex-col items-center justify-center h-full min-h-screen bg-gray-100">
  <h1 class="text-6xl font-bold mb-4 italic" style="background: linear-gradient(to right, #ff00cc, #9900ff, #00ccff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
    Student Marketplace
  </h1>
  <p class="text-lg text-gray-600 mb-8 text-center max-w-2xl">
    A place where students can buy and sell, and also explore opportunities...
  </p>

  <!-- Mobile Phone Icon and Text -->
  <div class="relative w-64 h-96 bg-pink-300 rounded-3xl shadow-xl flex items-center justify-center mb-12">
    <!-- Placeholder for phone icon. In a real app, you'd use an SVG icon library like Lucide or Heroicons -->
    <div class="absolute inset-0 flex items-center justify-center text-pink-700 text-8xl">
      📱
    </div>
    <div class="notes">
      <span class="note note1">your job is waiting</span>
      <span class="note note2">claim the giveaway!</span>
      <span class="note note3">sell your product</span>
      <span class="note note4">buy new items</span>
    </div>
  </div>
  <p class="relative z-10 text-black text-2xl font-bold text-center px-4 mt-4">
    Find your product!!
  </p>

  <div class="flex space-x-6 mt-8">
    <a href="/marketplace/buyer">
      <button class="bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg">
        Enter as Buyer
      </button>
    </a>
    <a href="/marketplace/seller">
      <button class="bg-pink-700 hover:bg-pink-800 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg">
        Enter as Seller
      </button>
    </a>
  </div>
</div>

<style>
  .notes {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    text-align: center;
  }

  .note {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    color: #00008B; /* Deep Blue */
    font-family: 'Brush Script MT', cursive;
    font-size: 1.5rem;
    opacity: 0;
    animation: fly 4s infinite;
  }

  .note1 { animation-delay: 0s; }
  .note2 { animation-delay: 1s; }
  .note3 { animation-delay: 2s; }
  .note4 { animation-delay: 3s; }

  @keyframes fly {
    0% {
      opacity: 0;
      transform: translate(-50%, 50px) rotate(0deg);
    }
    20% {
      opacity: 1;
      transform: translate(-50%, -20px) rotate(-5deg);
    }
    80% {
      opacity: 1;
      transform: translate(50px, -100px) rotate(10deg);
    }
    100% {
      opacity: 0;
      transform: translate(100px, -150px) rotate(15deg);
    }
  }
</style>