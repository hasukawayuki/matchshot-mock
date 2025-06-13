import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          {/* ヘッダー */}          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            MatchShot
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto drop-shadow">
            各マッチングアプリに特化したプロフィール写真をAIで生成
          </p>
          <p className="text-lg text-white mb-12 max-w-2xl mx-auto drop-shadow">
            Tinder、Pairs、with、タップル、東カレそれぞれの特徴に合わせた最適な写真を作成します
          </p>

          {/* メイン画像エリア */}
          <div className="mb-16">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8 items-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-gray-700">1. 顔写真をアップロード</p>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl mb-4">➡️</div>
                  <p className="text-lg font-semibold text-gray-700">2. AI が最適な背景を生成</p>
                </div>
                
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl">✨</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-700">3. 完璧なプロフィール写真</p>
                </div>
              </div>
            </div>
          </div>

          {/* 特徴 */}
          <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 text-white">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-2">プロレベルの仕上がり</h3>
              <p>自然光、理想的な構図、プロカメラマンが撮影したような高品質な写真を生成</p>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 text-white">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">わずか数秒で完成</h3>
              <p>最新のAI技術により、アップロードから完成まで数秒で高品質な写真を生成</p>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 text-white">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2">プライバシー保護</h3>
              <p>アップロードした写真は処理後に自動削除。あなたのプライバシーを最優先</p>
            </div>
          </div>

          {/* CTA ボタン */}
          <Link
            to="/generate"
            className="inline-block bg-white text-purple-600 font-bold text-xl px-12 py-4 rounded-full shadow-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
          >
            写真をアップロードして試す 📸
          </Link>
          
          <p className="text-white text-sm mt-4 opacity-80">
            無料で試せます • 登録不要
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
