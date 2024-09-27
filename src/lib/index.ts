import { writable, type Writable } from "svelte/store";

// ストアの定義
const count = writable(0);
const isError = writable(false);

// API呼び出し関数
const fetchAPI = async () => {
    try {
        const response = await fetch('/api/countup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ value: '-' })
        });
        const data = await response.json();
        console.log('Success:', data);
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

// カウントアップ関数
const updateCount = async (value: string) => {
    try {
        const response = await fetch('/api/countup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ value: value })
        });
        const data = await response.json();
        console.log('Success:', data);
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// キーダウンイベントハンドラの定義 / リセットカウント
let reset = 0;

const resetCount = async (event: KeyboardEvent, disp?: Writable<number>) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        reset++;
        console.log(reset);

        if (reset === 5) {
            try {
                const data = await fetchAPI();
                if (disp) disp.set(data.count);
                count.set(100);
                reset = 100;
                if (typeof window !== 'undefined') window.location.href = '/';
                console.log('reset');
            } catch (error) {
                console.error('Failed to fetch API:', error);
            }
        }

        setTimeout(() => {
            reset = 0;
        }, 2000);
    }
}

// コマンドの定義
const commandList = [
    { keys: 'cheat', action: (mordal: Writable<boolean>) => mordal.set(true) },
    { keys: 'glitch', action: (mordal: Writable<boolean>) => mordal.set(true) }
];

let commandBuffer = '';

const handleCommand = (event: KeyboardEvent, mordalC: Writable<boolean>, mordalG: Writable<boolean>) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
        commandBuffer = '';
        return;
    }

    commandBuffer += event.key;
    console.log(commandBuffer);

    for (const { keys, action } of commandList) {
        if (keys.startsWith(commandBuffer)) {
            if (keys === commandBuffer) {
                if (keys === 'cheet') {
                    action(mordalC);
                    console.log('cheet');
                } else if (keys === 'glitch') {
                    action(mordalG);
                    console.log('glitch');
                }
                commandBuffer = '';
            }
            return;
        }
    }

    commandBuffer = '';
}

// キーダウンイベントハンドラ
const handleKeydown = async (event: KeyboardEvent, disp: Writable<number>, mordalC: Writable<boolean>, mordalG: Writable<boolean>) => {
    resetCount(event, disp);
    handleCommand(event, mordalC, mordalG);
};

// メッセージイベントハンドラ
const onMessage = (event: MessageEvent, disp: Writable<number>) => {
    console.log('Received message:', event);
    const data = JSON.parse(event.data);
    disp.set(data.count);
};

// エラーイベントハンドラ
const onError = (event: Event, eventSource: EventSource, connectEventSource: () => void) => {
    const errorMessage = (event as any).message || '';
    console.error('Error occurred:', errorMessage);

    if (!errorMessage.startsWith('Error enqueuing message:') && !errorMessage.startsWith('Stream closed, stopping keep-alive:')) {
        isError.set(true); // エラーフラグを設定
    }

    if (eventSource.readyState === EventSource.CLOSED) {
        console.log('Reconnecting...');
        setTimeout(connectEventSource, 3000);
    }
};

// コンポーネントのインポート
import Button from './Button.svelte';

const goToResult = (storeCount: number) => {
    window.location.href = `/result?co=${storeCount}`;
};

// エクスポート
export { count, isError, fetchAPI, handleKeydown, updateCount, resetCount, onMessage, onError, Button, goToResult };