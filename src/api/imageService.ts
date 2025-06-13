import axios from 'axios';

const REPLICATE_API_TOKEN = process.env.REACT_APP_REPLICATE_API_TOKEN;
const MOCK_MODE = process.env.REACT_APP_MOCK_MODE === 'true';

export interface GenerateImageOptions {
  prompt: string;
  width?: number;
  height?: number;
  num_outputs?: number;
}

// メイン画像生成関数
export async function generateImage(options: GenerateImageOptions): Promise<string> {
  if (MOCK_MODE) {
    return generateMockImage();
  }

  const { prompt, width = 512, height = 768, num_outputs = 1 } = options;
  
  try {
    const response = await axios.post(
      'https://api.replicate.com/v1/predictions',
      {
        version: 'ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4',
        input: {
          prompt: prompt,
          width: width,
          height: height,
          num_outputs: num_outputs,
          guidance_scale: 7.5,
          num_inference_steps: 50,
        },
      },
      {
        headers: {
          Authorization: `Token ${REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const predictionId = response.data.id;
    let result = null;

    // Poll for completion
    while (!result) {
      const poll = await axios.get(
        `https://api.replicate.com/v1/predictions/${predictionId}`,
        {
          headers: {
            Authorization: `Token ${REPLICATE_API_TOKEN}`,
          },
        }
      );

      if (poll.data.status === 'succeeded') {
        result = poll.data.output[0];
      } else if (poll.data.status === 'failed') {
        throw new Error('画像生成に失敗しました');
      }
      
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    return result;
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('画像生成に失敗しました');
  }
}

// メイン顔交換関数
export async function swapFace(userFace: File, targetImageUrl: string): Promise<string> {
  if (MOCK_MODE) {
    return swapFaceMock(userFace, targetImageUrl);
  }

  const FACESWAP_API_URL = process.env.REACT_APP_FACESWAP_API_URL;
  
  try {
    const formData = new FormData();
    formData.append('source', userFace);
    formData.append('target_url', targetImageUrl);

    const response = await axios.post(`${FACESWAP_API_URL}/swap`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.output_url;
  } catch (error) {
    console.error('Error swapping face:', error);
    throw new Error('顔の合成に失敗しました');
  }
}

// モック関数群
export function generateMockImage(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // より現実的なプロフィール写真のモック画像
      const mockImages = [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=512&h=768&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1494790108755-2616c95eb3c7?w=512&h=768&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=512&h=768&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?w=512&h=768&fit=crop&crop=face'
      ];
      const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
      resolve(randomImage);
    }, 2000);
  });
}

export function swapFaceMock(userFace: File, targetImageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 顔交換後のモック画像
      const swappedMockImages = [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=512&h=768&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=512&h=768&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=512&h=768&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=512&h=768&fit=crop&crop=face'
      ];
      const randomImage = swappedMockImages[Math.floor(Math.random() * swappedMockImages.length)];
      resolve(randomImage);
    }, 1500);
  });
}

// 統合関数：画像生成→顔交換の一連の流れ
export async function generateAndSwapFace(userFace: File, prompt: string): Promise<{
  originalImage: string;
  finalImage: string;
}> {
  try {
    // 1. AI画像生成
    const aiImage = await generateImage({ prompt });
    
    // 2. 顔交換
    const finalImage = await swapFace(userFace, aiImage);
    
    return {
      originalImage: aiImage,
      finalImage: finalImage
    };
  } catch (error) {
    console.error('Error in generateAndSwapFace:', error);
    throw error;
  }
}
