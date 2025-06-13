import React from 'react';
import { Link } from 'react-router-dom';

const Done: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* 成功メッセージ */}
          <div className="bg-white rounded-3xl shadow-2xl p-12 mb-12">
            <div className="text-8xl mb-6">🎉</div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              プロフィール写真が完成しました！
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              あなたの新しいプロフィール写真が生成されました。SNSやマッチングアプリで素敵な印象を与えること間違いなしです！
            </p>
            
            {/* 統計情報 */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">✨</div>
                <div className="text-lg font-semibold text-gray-700">AI 生成完了</div>
                <div className="text-sm text-gray-600">最新技術で作成</div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">🎯</div>
                <div className="text-lg font-semibold text-gray-700">高品質</div>
                <div className="text-sm text-gray-600">プロレベルの仕上がり</div>
              </div>
              
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">⚡</div>
                <div className="text-lg font-semibold text-gray-700">高速処理</div>
                <div className="text-sm text-gray-600">数秒で完成</div>
              </div>
            </div>
          </div>

          {/* SNS共有セクション */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl p-8 mb-12 text-white">
            <h2 className="text-3xl font-bold mb-6">📱 SNSで共有しよう</h2>
            <p className="text-lg mb-8 opacity-90">
              新しいプロフィール写真を友達に自慢しませんか？
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105">
                📘 Facebook
              </button>
              <button className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105">
                🐦 Twitter
              </button>
              <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105">
                📷 Instagram
              </button>
              <button className="bg-blue-800 hover:bg-blue-900 text-white font-bold px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105">
                💼 LinkedIn
              </button>
            </div>
          </div>

          {/* 次のアクション */}
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">🚀 次に何をしますか？</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
                <div className="text-4xl mb-4">🔄</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">別のスタイルで作成</h3>
                <p className="text-gray-600 mb-4">
                  他の背景やスタイルでも試してみませんか？
                </p>
                <Link
                  to="/generate"
                  className="inline-block bg-purple-600 text-white font-bold px-6 py-3 rounded-full hover:bg-purple-700 transition-all duration-300"
                >
                  もう一度作成する
                </Link>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6">
                <div className="text-4xl mb-4">💡</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">MatchShotを広める</h3>
                <p className="text-gray-600 mb-4">
                  友達にもこの素晴らしい体験を共有しませんか？
                </p>
                <Link
                  to="/"
                  className="inline-block bg-blue-600 text-white font-bold px-6 py-3 rounded-full hover:bg-blue-700 transition-all duration-300"
                >
                  トップページへ
                </Link>
              </div>
            </div>
          </div>

          {/* フィードバック */}
          <div className="mt-12 text-white text-center">
            <p className="text-lg mb-4">
              MatchShotはいかがでしたか？
            </p>
            <div className="flex justify-center gap-2">
              <button className="text-2xl hover:scale-125 transition-transform">⭐</button>
              <button className="text-2xl hover:scale-125 transition-transform">⭐</button>
              <button className="text-2xl hover:scale-125 transition-transform">⭐</button>
              <button className="text-2xl hover:scale-125 transition-transform">⭐</button>
              <button className="text-2xl hover:scale-125 transition-transform">⭐</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Done;
