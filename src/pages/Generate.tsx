import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateAndSwapFace } from '../api/imageService';

interface StyleTemplate {
  id: string;
  name: string;
  appIcon: string;
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
    name: 'Tinder',
    appIcon: '🔥'
  },
  {
    id: 'pairs',
    name: 'Pairs',
    appIcon: '💑'
  },
  {
    id: 'with',
    name: 'with',
    appIcon: '🎯'
  },
  {
    id: 'tapple',
    name: 'タップル',
    appIcon: '🎪'
  },
  {
    id: 'tokare',
    name: '東カレデート',
    appIcon: '👑'
  },
  {
    id: 'natural',
    name: '汎用スタイル',
    appIcon: '🌟'
  }
];

const situationOptions = [
  { id: 'cafe', name: 'カフェ', description: 'おしゃれなカフェで' },
  { id: 'outdoor', name: 'アウトドア', description: '自然な屋外で' },
  { id: 'urban', name: '都市部', description: 'スタイリッシュな街並みで' },
  { id: 'studio', name: 'スタジオ', description: 'プロのスタジオで' },
  { id: 'home', name: '自宅', description: 'リラックスした自宅で' },
  { id: 'office', name: 'オフィス', description: 'モダンなオフィスで' }
];

const poseOptions = [
  { id: 'full_body', name: '全身', description: '頭から足まで全体を写した写真' },
  { id: 'upper_body', name: '上半身', description: '胸から上を写した写真' },
  { id: 'headshot', name: '顔中心', description: '顔を中心とした写真' },
  { id: 'side_profile', name: '横顔', description: '横から撮った写真' }
];

const expressionOptions = [
  { id: 'smile', name: '笑顔', description: '自然で親しみやすい笑顔' },
  { id: 'gentle', name: '穏やか', description: '優しく落ち着いた表情' },
  { id: 'cool', name: 'クール', description: '知的でかっこいい表情' },
  { id: 'confident', name: '自信満々', description: '堂々とした表情' }
];

const atmosphereOptions = [
  { id: 'bright', name: '明るい', description: '爽やかで明るい雰囲気' },
  { id: 'warm', name: '温かい', description: '親しみやすく温かい雰囲気' },
  { id: 'elegant', name: '上品', description: '洗練された上品な雰囲気' },
  { id: 'natural', name: '自然体', description: 'ありのままの自然な雰囲気' },
  { id: 'professional', name: 'プロフェッショナル', description: '仕事ができそうな雰囲気' }
];

const Generate: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>('tinder');
  const [photoOptions, setPhotoOptions] = useState<PhotoOptions>({
    situation: 'cafe',
    pose: 'upper_body',
    expression: 'smile',
    atmosphere: 'bright'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [step, setStep] = useState<'upload' | 'options' | 'generating' | 'result'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const generatePrompt = (): string => {
    const app = styleTemplates.find(t => t.id === selectedStyle);
    const situation = situationOptions.find(s => s.id === photoOptions.situation);
    const pose = poseOptions.find(p => p.id === photoOptions.pose);
    const expression = expressionOptions.find(e => e.id === photoOptions.expression);
    const atmosphere = atmosphereOptions.find(a => a.id === photoOptions.atmosphere);

    let basePrompt = `young adult with ${expression?.id} expression, ${pose?.id} shot, `;
    
    // アプリごとの特徴を追加
    switch (selectedStyle) {
      case 'tinder':
        basePrompt += 'trendy casual outfit, urban modern style, ';
        break;
      case 'pairs':
        basePrompt += 'smart casual clothing, trustworthy appearance, ';
        break;
      case 'with':
        basePrompt += 'casual comfortable clothing, active lifestyle, ';
        break;
      case 'tapple':
        basePrompt += 'bright colorful outfit, youthful energy, ';
        break;
      case 'tokare':
        basePrompt += 'luxury designer clothing, sophisticated style, ';
        break;
      default:
        basePrompt += 'casual versatile outfit, ';
    }

    // シチュエーションを追加
    switch (photoOptions.situation) {
      case 'cafe':
        basePrompt += 'modern cafe setting, ';
        break;
      case 'outdoor':
        basePrompt += 'natural outdoor environment, ';
        break;
      case 'urban':
        basePrompt += 'stylish urban background, ';
        break;
      case 'studio':
        basePrompt += 'professional studio setting, ';
        break;
      case 'home':
        basePrompt += 'comfortable home interior, ';
        break;
      case 'office':
        basePrompt += 'modern office environment, ';
        break;
    }

    // 雰囲気を追加
    basePrompt += `${atmosphere?.id} atmosphere, high quality portrait, dating app profile style`;

    return basePrompt;
  };

  const handleGenerate = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setStep('generating');

    try {
      const prompt = generatePrompt();
      const result = await generateAndSwapFace(selectedFile, prompt);
      
      setGeneratedImage(result.finalImage);
      setStep('result');
    } catch (error) {
      console.error('生成エラー:', error);
      alert('画像の生成に失敗しました。もう一度お試しください。');
      setStep('options');
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
    setStep('options');
    setGeneratedImage(null);
  };

  const handleReset = () => {
    setStep('upload');
    setSelectedFile(null);
    setOriginalImage(null);
    setGeneratedImage(null);
  };

  if (step === 'upload') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              📸 マッチングアプリ特化プロフィール写真生成
            </h1>
            <p className="text-lg text-gray-600">
              顔写真をアップロードしてください
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold mb-6 text-center">📸 顔写真をアップロード</h3>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-purple-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {originalImage ? (
                  <div>
                    <img 
                      src={originalImage} 
                      alt="アップロード画像" 
                      className="max-w-full h-64 object-cover mx-auto rounded-lg mb-4" 
                    />
                    <p className="text-green-600 font-semibold">✅ 画像が選択されました</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setStep('options');
                      }}
                      className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors"
                    >
                      次へ進む →
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="text-6xl mb-4">📷</div>
                    <p className="text-lg font-semibold text-gray-700 mb-2">
                      クリックまたはドラッグ&ドロップ
                    </p>
                    <p className="text-sm text-gray-500">
                      JPG, PNG形式対応（最大10MB）
                    </p>
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
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/')}
              className="text-purple-600 hover:text-purple-800 font-semibold transition-colors"
            >
              ← トップページに戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'options') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              🎨 写真の詳細設定
            </h1>
            <p className="text-lg text-gray-600">
              理想的なプロフィール写真のスタイルを選択してください
            </p>
          </div>

          <div className="max-w-6xl mx-auto space-y-8">
            {/* マッチングアプリ選択 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">📱 マッチングアプリ選択</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {styleTemplates.map((template) => (
                  <label 
                    key={template.id} 
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 text-center ${
                      selectedStyle === template.id 
                        ? 'border-purple-500 bg-purple-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="app"
                      value={template.id}
                      checked={selectedStyle === template.id}
                      onChange={(e) => setSelectedStyle(e.target.value)}
                      className="hidden"
                    />
                    <div className="text-3xl mb-2">{template.appIcon}</div>
                    <div className="font-semibold text-sm">{template.name}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* シチュエーション */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">📍 シチュエーション</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {situationOptions.map((option) => (
                  <label 
                    key={option.id} 
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      photoOptions.situation === option.id 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="situation"
                      value={option.id}
                      checked={photoOptions.situation === option.id}
                      onChange={(e) => setPhotoOptions({...photoOptions, situation: e.target.value})}
                      className="hidden"
                    />
                    <div className="font-semibold">{option.name}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* ポーズ */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">🧍 ポーズ</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {poseOptions.map((option) => (
                  <label 
                    key={option.id} 
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      photoOptions.pose === option.id 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pose"
                      value={option.id}
                      checked={photoOptions.pose === option.id}
                      onChange={(e) => setPhotoOptions({...photoOptions, pose: e.target.value})}
                      className="hidden"
                    />
                    <div className="font-semibold">{option.name}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* 表情 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">😊 表情</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {expressionOptions.map((option) => (
                  <label 
                    key={option.id} 
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      photoOptions.expression === option.id 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="expression"
                      value={option.id}
                      checked={photoOptions.expression === option.id}
                      onChange={(e) => setPhotoOptions({...photoOptions, expression: e.target.value})}
                      className="hidden"
                    />
                    <div className="font-semibold">{option.name}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* 雰囲気 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">✨ 写真の雰囲気</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {atmosphereOptions.map((option) => (
                  <label 
                    key={option.id} 
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      photoOptions.atmosphere === option.id 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="atmosphere"
                      value={option.id}
                      checked={photoOptions.atmosphere === option.id}
                      onChange={(e) => setPhotoOptions({...photoOptions, atmosphere: e.target.value})}
                      className="hidden"
                    />
                    <div className="font-semibold">{option.name}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* 生成ボタン */}
            <div className="text-center space-y-4">
              <button
                onClick={handleGenerate}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl px-12 py-4 rounded-full shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
              >
                🚀 プロフィール写真を生成
              </button>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleReset}
                  className="text-gray-600 hover:text-gray-800 font-semibold"
                >
                  ← 画像を変更
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="text-purple-600 hover:text-purple-800 font-semibold"
                >
                  トップページに戻る
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'generating') {
    const selectedTemplate = styleTemplates.find(t => t.id === selectedStyle);
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <div className="animate-spin w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-6"></div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                {selectedTemplate?.appIcon} AI が画像を生成中...
              </h3>
              <div className="space-y-3 text-gray-600">
                <p>✨ {selectedTemplate?.name}に最適な写真を作成しています</p>
                <p>🎭 あなたの顔を自然に合成しています</p>
                <p>🎨 設定した雰囲気に調整しています</p>
                <p>🖼️ 最終仕上げを行っています</p>
              </div>
              <div className="mt-6 text-sm text-gray-500">
                通常1-2分で完了します
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'result' && generatedImage) {
    const selectedTemplate = styleTemplates.find(t => t.id === selectedStyle);
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-center mb-2">
                🎉 {selectedTemplate?.name}向けプロフィール写真が完成！
              </h3>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="text-center">
                  <h4 className="text-lg font-semibold mb-4">Before（元画像）</h4>
                  {originalImage && (
                    <img 
                      src={originalImage} 
                      alt="元画像" 
                      className="w-full max-w-sm mx-auto rounded-lg shadow-md" 
                    />
                  )}
                </div>
                
                <div className="text-center">
                  <h4 className="text-lg font-semibold mb-4">
                    After（{selectedTemplate?.appIcon} {selectedTemplate?.name}向け）
                  </h4>
                  <img 
                    src={generatedImage} 
                    alt="生成画像" 
                    className="w-full max-w-sm mx-auto rounded-lg shadow-md" 
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleDownload}
                  className="bg-green-600 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
                >
                  📥 画像をダウンロード
                </button>
                <button
                  onClick={handleTryAgain}
                  className="bg-purple-600 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                  🔄 設定を変更して再生成
                </button>
                <button
                  onClick={() => navigate('/done')}
                  className="bg-blue-600 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                >
                  ✨ 完了画面へ
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/')}
              className="text-purple-600 hover:text-purple-800 font-semibold transition-colors"
            >
              ← トップページに戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Generate;
