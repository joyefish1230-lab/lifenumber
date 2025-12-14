class NumerologyTriangle {
    constructor() {
        this.templateImagePath = 'images/最新模板圖.png';
        this.initializeDatePickers();
        this.bindEvents();
        this.loadFromURL();
    }

    /**
     * 初始化日期選擇器
     */
    initializeDatePickers() {
        // 初始化年份選項 (1905-2030)
        const yearSelect = document.getElementById('year');
        if (yearSelect) {
            for (let year = 2030; year >= 1905; year--) {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                yearSelect.appendChild(option);
            }
            yearSelect.value = new Date().getFullYear();
        }

        // 初始化月份選項 (1-12)
        const monthSelect = document.getElementById('month');
        if (monthSelect) {
            for (let month = 1; month <= 12; month++) {
                const option = document.createElement('option');
                option.value = month;
                option.textContent = month;
                monthSelect.appendChild(option);
            }
            monthSelect.value = new Date().getMonth() + 1;
        }

        // 監聽年月變化以更新日期
        if (yearSelect) yearSelect.addEventListener('change', () => this.updateDays());
        if (monthSelect) monthSelect.addEventListener('change', () => this.updateDays());

        // 初始化日期選項
        this.updateDays();
    }

    /**
     * 更新日期選項
     */
    updateDays() {
        const year = parseInt(document.getElementById('year')?.value);
        const month = parseInt(document.getElementById('month')?.value);
        const daySelect = document.getElementById('day');
        
        if (!daySelect) return;
        
        // 清空現有選項
        daySelect.innerHTML = '';
        
        if (!year || !month) return;
        
        // 計算該月份的天數
        const daysInMonth = new Date(year, month, 0).getDate();
        
        for (let day = 1; day <= daysInMonth; day++) {
            const option = document.createElement('option');
            option.value = day;
            option.textContent = day;
            daySelect.appendChild(option);
        }

        // 設置預設值
        if (daySelect.children.length > 0) {
            daySelect.value = Math.min(new Date().getDate(), daysInMonth);
        }
    }

    /**
     * 綁定事件監聽器
     */
    bindEvents() {
        const calculatorForm = document.getElementById('calculatorForm');
        if (calculatorForm) {
            calculatorForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.calculateTriangle();
            });
        }
    }

    /**
     * 從URL載入結果 (用於result.html)
     */
    loadFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const year = urlParams.get('year');
        const month = urlParams.get('month');
        const day = urlParams.get('day');

        if (year && month && day && document.getElementById('triangleCanvas')) {
            const result = this.performCalculation(parseInt(year), parseInt(month), parseInt(day));
            this.displayResults(result);
        }
    }

    /**
     * 將數字減為個位數
     */
    reduceToSingleDigit(num) {
        while (num > 9) {
            const digits = num.toString().split('');
            num = digits.reduce((sum, digit) => sum + parseInt(digit), 0);
        }
        return num;
    }

    /**
     * 解析日期為各個位數
     */
    parseDate(year, month, day) {
        // 正確處理月份格式
        const A = Math.floor(day / 10) || 0;    // 日期十位數
        const B = day % 10;                     // 日期個位數
        const C = Math.floor(month / 10) || 0;  // 月份十位數
        const D = month % 10;                   // 月份個位數
        
        const yearStr = year.toString().padStart(4, '0');
        const E = parseInt(yearStr[0]) || 0;    // 年份千位數
        const F = parseInt(yearStr[1]) || 0;    // 年份百位數
        const G = parseInt(yearStr[2]) || 0;    // 年份十位數
        const H = parseInt(yearStr[3]) || 0;    // 年份個位數
        
        return { A, B, C, D, E, F, G, H };
    }

    /**
     * 執行三角形計算 (從index.html跳轉到result.html)
     */
    calculateTriangle() {
        const year = parseInt(document.getElementById('year')?.value);
        const month = parseInt(document.getElementById('month')?.value);
        const day = parseInt(document.getElementById('day')?.value);

        if (!year || !month || !day) {
            alert('請選擇完整的出生日期');
            return;
        }

        // 跳轉到結果頁面
        window.location.href = `result.html?year=${year}&month=${month}&day=${day}`;
    }

    /**
     * 執行具體計算邏輯
     */
    performCalculation(year, month, day) {
        const { A, B, C, D, E, F, G, H } = this.parseDate(year, month, day);
        
        // 第一層計算 (底層)
        const I = this.reduceToSingleDigit(A + B);      // 日期總和
        const J = this.reduceToSingleDigit(C + D);      // 月份總和
        const K = this.reduceToSingleDigit(E + F);      // 年份前兩位總和
        const L = this.reduceToSingleDigit(G + H);      // 年份後兩位總和
        
        // 第二層計算
        const M = this.reduceToSingleDigit(I + J);      // 左側
        const N = this.reduceToSingleDigit(K + L);      // 右側
        
        // 第三層計算 (主性格)
        const O = this.reduceToSingleDigit(M + N);      // 頂點 - 主性格
        
        // 外三角形計算
        const S = this.reduceToSingleDigit(I + M);      // 左下外
        const T = this.reduceToSingleDigit(J + M);      // 左上外
        const U = this.reduceToSingleDigit(S + T);      // 左外結果

        const V = this.reduceToSingleDigit(K + N);      // 右上外
        const W = this.reduceToSingleDigit(L + N);      // 右下外
        const X = this.reduceToSingleDigit(V + W);      // 右外結果

        const P = this.reduceToSingleDigit(M + O);      // 上左外
        const Q = this.reduceToSingleDigit(N + O);      // 上右外
        const R = this.reduceToSingleDigit(P + Q);      // 上外結果

        return {
            // 原始數據
            originalDate: { A, B, C, D, E, F, G, H },
            birthDate: { year, month, day },
            // 內三角形
            inner: { I, J, K, L, M, N, O },
            // 外三角形
            outer: { P, Q, R, S, T, U, V, W, X }
        };
    }

    /**
     * 顯示計算結果
     */
    displayResults(result) {
        // 繪製三角形
        this.drawTriangle(result);
        
        // 更新結果表格
        this.updateResultsTable(result);
    }

    /**
     * 更新結果表格
     */
    updateResultsTable(result) {
        const updateElement = (id, value) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        };

        updateElement('result-main', result.inner.O);
        updateElement('result-inner', `${result.inner.O}${result.inner.M}${result.inner.N}`);
        updateElement('result-outer', `${result.outer.S}${result.outer.R}${result.outer.T}`);
        updateElement('result-subconscious', `${result.inner.L}${result.inner.I}${result.inner.O}`);
        updateElement('result-father', `${result.inner.I}${result.inner.J}${result.inner.M}`);
        updateElement('result-mother', `${result.inner.K}${result.inner.L}${result.inner.N}`);
        updateElement('result-work', `${result.outer.T}${result.outer.S}${result.outer.U}`);
        updateElement('result-family', `${result.outer.Q}${result.outer.P}${result.outer.R}`);
        updateElement('result-elder', `${result.outer.V}${result.outer.W}${result.outer.X}`);
    }

    /**
     * 繪製生命數字三角形 (使用模板圖片)
     */
    /**
     * 繪製生命數字三角形 (使用模板圖片)
     */
    drawTriangle(result) {
        const canvas = document.getElementById('triangleCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // 【修正點 1】: 設置畫布大小為 400x400，以保持 1:1 比例，避免模板圖失真
        canvas.width = 400;
        canvas.height = 400;
        
        // 載入模板圖片
        const templateImage = new Image();
        templateImage.onload = () => {
            // 清空畫布並填充白色背景
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // 繪製模板圖片 (將 1200x1200 圖片等比例縮放到 400x400)
            ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height);
            
            // 繪製數字
            this.drawNumbers(ctx, result);
        };
        
        templateImage.onerror = () => {
            console.warn('無法載入模板圖片，使用繪製版本');
            this.drawTemplateFromScratch(ctx, result);
        };
        
        templateImage.src = this.templateImagePath;
    }

    /**
     * 在模板圖片上繪製數字
     */
    
    /**
     * 在模板圖片上繪製數字 (畫布為 400x400)
     */
    drawNumbers(ctx, result) {
        // 設置數字樣式
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // --- 內部三角形 (O, M, N, I, J, K, L) ---
        ctx.fillStyle = 'black';
        
        // O (主性格) - 約 130px 高度
        ctx.fillStyle = 'red';
        ctx.font = 'bold 24px Arial';
        ctx.fillText(result.inner.O, 200, 169); // X=400/2=200
        
        // M, N (第二層) - 約 220px 高度
        ctx.fillStyle = 'black';
        ctx.font = 'bold 18px Arial';
        ctx.fillText(result.inner.M, 160, 240); // 調整: 向內三角形左側中心移動
        ctx.fillText(result.inner.N, 240, 240); // 調整: 向內三角形右側中心移動
        
        // I, J, K, L (第三層) - 約 310px 高度
        ctx.font = 'bold 18px Arial';
        ctx.fillText(result.inner.I, 120, 311); // 左左
        ctx.fillText(result.inner.J, 169, 311); // 左右
        ctx.fillText(result.inner.K, 231, 311); // 右左
        ctx.fillText(result.inner.L, 280, 311); // 右右
        
        // --- 外部數字 (U, T, S, X, V, W, R, Q, P) ---
        ctx.fillStyle = 'black';
        ctx.font = 'bold 18px Arial';

        // 頂部 R
        const topR_Y = 30;
        ctx.fillText(result.outer.R, 200, topR_Y); 
        
        // 頂部 Q, P
        const topQP_Y = 75;
        ctx.font = 'bold 18px Arial';
        ctx.fillText(result.outer.Q, 160, topQP_Y);
        ctx.fillText(result.outer.P, 240, topQP_Y);
        
        // 左側外三角形 (U, T, S)
        const leftLine_Y = 124; 
        
        // U (與左側水平線對齊)
        ctx.font = 'bold 18px Arial';
        ctx.fillText(result.outer.U, 93, leftLine_Y); 

        // T, S (靠近斜邊)
        ctx.font = 'bold 18px Arial';
        ctx.fillText(result.outer.T, 53, 169);
        ctx.fillText(result.outer.S, 133, 169);
        
        
        // 右側外三角形 (X, V, W)
        const rightLine_Y = 124; 
        
        // X (與右側水平線對齊)
        ctx.font = 'bold 18px Arial';
        ctx.fillText(result.outer.X, 307, rightLine_Y);

        // V, W (靠近斜邊)
        ctx.font = 'bold 18px Arial';
        ctx.fillText(result.outer.V, 267, 169); 
        ctx.fillText(result.outer.W, 347, 169); 


        // --- 底部生日數據及標籤 ---
        ctx.fillStyle = 'black';
        ctx.font = 'bold 14px Arial';
        const { A, B, C, D, E, F, G, H } = result.originalDate;
        
        // 底部數字 (Y=350)
        const baseY = 370;
        
        const dayStr = (A * 10 + B).toString().padStart(2, '0');
        const monthStr = (C * 10 + D).toString().padStart(2, '0');
        const yearPreStr = (E * 10 + F).toString().padStart(2, '0');
        const yearPostStr = (G * 10 + H).toString().padStart(2, '0');

        ctx.fillText(dayStr, 110, baseY); 
        ctx.fillText(monthStr, 180, baseY); 
        ctx.fillText(yearPreStr, 220, baseY); 
        ctx.fillText(yearPostStr, 290, baseY); 
        
        // 底部標籤
        ctx.font = '12px Arial';
        ctx.fillText('日期', 110, baseY + 20);
        ctx.fillText('月份', 180, baseY + 20);
        ctx.fillText('年份', 255, baseY + 20); // 放在年份中間 (220 和 290 的中間)
    }
    /**
     * 備用繪製方案 (如果模板圖片載入失敗)
     */
    drawTemplateFromScratch(ctx, result) {
        // 清空畫布並填充白色背景
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 500, 400);
        
        // 繪製三角形結構
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        
        // 主三角形
        ctx.beginPath();
        ctx.moveTo(250, 100);
        ctx.lineTo(400, 350);
        ctx.lineTo(100, 350);
        ctx.closePath();
        ctx.stroke();
        
        // 內部分割線
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(175, 225);
        ctx.lineTo(325, 225);
        ctx.moveTo(210, 275);
        ctx.lineTo(290, 275);
        ctx.moveTo(250, 225);
        ctx.lineTo(250, 350);
        ctx.stroke();
        
        // 外部框線
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(200, 25);
        ctx.lineTo(300, 25);
        ctx.moveTo(25, 150);
        ctx.lineTo(25, 200);
        ctx.moveTo(475, 150);
        ctx.lineTo(475, 200);
        ctx.stroke();
        
        // 繪製數字
        this.drawNumbers(ctx, result);
    }

    /**
     * 下載三角形圖片
     */
    downloadTriangle() {
        const canvas = document.getElementById('triangleCanvas');
        if (!canvas) {
            alert('找不到畫布元素');
            return;
        }
        
        try {
            // 創建下載連結
            const link = document.createElement('a');
            link.download = '生命靈數三角形.png';
            
            // 將canvas轉換為圖片資料
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                link.href = url;
                
                // 觸發下載
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // 釋放記憶體
                URL.revokeObjectURL(url);
            }, 'image/png');
            
        } catch (error) {
            console.error('下載失敗:', error);
            // 由於不能使用 alert，這裡僅在控制台顯示錯誤
            console.log('下載失敗，請稍後再試'); 
        }
    }
}

// 全域函數
function downloadTriangle() {
    const triangleInstance = window.triangleInstance || new NumerologyTriangle();
    triangleInstance.downloadTriangle();
}

function recalculate() {
    window.location.href = 'index.html#calculator';
}

// 初始化應用程序
document.addEventListener('DOMContentLoaded', () => {
    window.triangleInstance = new NumerologyTriangle();
});