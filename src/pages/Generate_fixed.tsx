import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateAndSwapFace } from '../api/imageService';

interface StyleTemplate {
  id: string;
  name: string;
  appIcon: string;
  prompt: string;
  description: string;
}

interface PhotoOptions {
  situation: string;
  pose: string;
  expression: string;
  atmosphere: string;
}

const styleTemplates: StyleTemplate[] = [
  {
    id: 'tinder',
    name: 'Tinder スタイル',
    appIcon: '🔥',
    prompt: 'attractive young adult, confident smile, trendy casual outfit, urban background, natural lighting, cool and approachable vibe, dating app photo, high quality portrait, street style fashion',
    description: 'カジュアルでクールな印象。都市的でトレンディな雰囲気でマッチ率UP'
  },
  {
    id: 'pairs',
    name: 'Pairs スタイル',
    appIcon: '💑',
    prompt: 'friendly young adult, warm genuine smile, smart casual clothing, clean bright background, soft natural lighting, trustworthy and approachable, relationship-focused photo, professional yet friendly',
    description: '真面目で誠実な印象。結婚を意識した上品なスタイルで好印象'
  },
  {
    id: 'with',
    name: 'with スタイル',
    appIcon: '🎯',
    prompt: 'young adult with hobby props, enthusiastic expression, casual comfortable clothing, hobby-related background, bright cheerful lighting, active lifestyle, interests-focused photo, engaging personality',
    description: '趣味を楽しむアクティブな印象。共通の趣味で繋がりやすい'
  },
  {
    id: 'tapple',
    name: 'タップル スタイル',
    appIcon: '🎪',
    prompt: 'cheerful young adult, bright energetic smile, colorful trendy outfit, fun vibrant background, high-energy lighting, youthful and playful vibe, social media style photo, lively personality',
    description: '明るく楽しい印象。気軽で友達感覚のカジュアルスタイル'
  },
  {
    id: 'tokare',
    name: '東カレ スタイル',
    appIcon: '👑',
    prompt: 'sophisticated young adult, elegant refined smile, luxury designer clothing, upscale elegant background, premium studio lighting, high-class and polished, exclusive luxury style, professional model quality',
    description: 'エレガントで洗練された印象。ハイクラス向けの上質なスタイル'
  },
  {
    id: 'natural',
    name: '汎用スタイル',
    appIcon: '🌟',
    prompt: 'young adult smiling in natural light, solo shot, casual clothing, full body, blurred background, dating app profile photo style, professional photography',
    description: '自然で親しみやすい汎用的なスタイル。どのアプリでも使える'
  }
];

const Generate: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>('tinder');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [step, setStep] = useState<'upload' | 'generating' | 'result'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // プレビュー画像を作成
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setStep('generating');

    try {
      const selectedTemplate = styleTemplates.find(t => t.id === selectedStyle);
      const prompt = selectedTemplate?.prompt || styleTemplates[0].prompt;
      
      // 統合API呼び出し：画像生成→顔交換
      const result = await generateAndSwapFace(selectedFile, prompt);
      
      setGeneratedImage(result.finalImage);
      setStep('result');
    } catch (error) {
      console.error('生成エラー:', error);
      alert('画像の生成に失敗しました。もう一度お試しください。');
      setStep('upload');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      const selectedTemplate = styleTemplates.find(t => t.id === selectedStyle);
      link.download = `matchshot-${selectedTemplate?.name || 'profile'}.jpg`;
      link.click();
    }
  };

  const handleTryAgain = () => {
    setStep('upload');
    setSelectedFile(null);
    setOriginalImage(null);
    setGeneratedImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🚀 マッチングアプリ専用写真を生成 (FIXED版)</h1>
          <p className="text-lg text-gray-600">各アプリの特徴に合わせたプロフィール写真を作成しましょう</p>
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            ✅ Generate_fixed.tsx が正しく読み込まれています
          </div>
        </div>

        {step === 'upload' && (
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* 画像アップロード */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">📸 顔写真をアップロード</h3>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {originalImage ? (
                    <div>
                      <img src={originalImage} alt="アップロード画像" className="max-w-full h-48 object-cover mx-auto rounded-lg mb-4" />
                      <p className="text-green-600 font-semibold">✅ 画像が選択されました</p>
                    </div>
                  ) : (
                    <div>
                      <div className="text-6xl mb-4">📷</div>
                      <p className="text-lg font-semibold text-gray-700 mb-2">クリックして写真を選択</p>
                      <p className="text-sm text-gray-500">JPG, PNG形式対応</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png"
                  onChange={handleFileSelect}
                />
              </div>

              {/* スタイル選択 */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">🎨 マッチングアプリを選択</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {styleTemplates.map((template) => (
                    <label key={template.id} className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedStyle === template.id 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="style"
                        value={template.id}
                        checked={selectedStyle === template.id}
                        onChange={(e) => setSelectedStyle(e.target.value)}
                        className="mr-3 mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="text-2xl mr-2">{template.appIcon}</span>
                          <span className="font-semibold text-gray-800">{template.name}</span>
                        </div>
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* 生成ボタン */}
            <div className="text-center mt-8">
              <button
                onClick={handleGenerate}
                disabled={!selectedFile || isLoading}
                className="bg-purple-600 text-white font-bold text-xl px-12 py-4 rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {isLoading ? '生成中...' : '🚀 プロフィール写真を生成'}
              </button>
              
              {selectedFile && (
                <p className="mt-4 text-gray-600">
                  {styleTemplates.find(t => t.id === selectedStyle)?.appIcon} 
                  <strong>{styleTemplates.find(t => t.id === selectedStyle)?.name}</strong> で生成します
                </p>
              )}
            </div>
          </div>
        )}

        {step === 'generating' && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <div className="animate-spin w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-6"></div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                {styleTemplates.find(t => t.id === selectedStyle)?.appIcon} AI が画像を生成中...
              </h3>
              <div className="space-y-2 text-gray-600">
                <p>✨ {styleTemplates.find(t => t.id === selectedStyle)?.name}に最適な背景を作成中</p>
                <p>🎭 あなたの顔を自然に合成中</p>
                <p>🖼️ 最終調整を実行中</p>
              </div>
              <div className="mt-6 text-sm text-gray-500">
                通常1-2分で完了します
              </div>
            </div>
          </div>
        )}

        {step === 'result' && generatedImage && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-center mb-2">
                🎉 {styleTemplates.find(t => t.id === selectedStyle)?.name} 写真が完成！
              </h3>
              <p className="text-center text-gray-600 mb-8">
                {styleTemplates.find(t => t.id === selectedStyle)?.description}
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Before */}
                <div className="text-center">
                  <h4 className="text-lg font-semibold mb-4">Before（元画像）</h4>
                  {originalImage && (
                    <img src={originalImage} alt="元画像" className="w-full max-w-sm mx-auto rounded-lg shadow-md" />
                  )}
                </div>
                
                {/* After */}
                <div className="text-center">
                  <h4 className="text-lg font-semibold mb-4">
                    After（{styleTemplates.find(t => t.id === selectedStyle)?.appIcon} {styleTemplates.find(t => t.id === selectedStyle)?.name}）
                  </h4>
                  <img src={generatedImage} alt="生成画像" className="w-full max-w-sm mx-auto rounded-lg shadow-md" />
                </div>
              </div>

              {/* アクションボタン */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleDownload}
                  className="bg-green-600 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300"
                >
                  📥 画像をダウンロード
                </button>
                <button
                  onClick={handleTryAgain}
                  className="bg-purple-600 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300"
                >
                  🔄 別のスタイルで試す
                </button>
                <button
                  onClick={() => navigate('/done')}
                  className="bg-blue-600 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300"
                >
                  ✨ 完了画面へ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 戻るボタン */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/')}
            className="text-purple-600 hover:text-purple-800 font-semibold"
          >
            ← トップページに戻る
          </button>
        </div>
      </div>
    </div>
  );
};

export default Generate;
