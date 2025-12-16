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
     * 【新增】計算內心密碼
     * 規則: O=1->2, O=2->4, O=3->6, O=4->8, O=5->1, O=6->3, O=7->5, O=8->7, O=9->9
     */
    calculateInnerCode(O) {
        const mapping = {
            1: 2, 2: 4, 3: 6, 4: 8, 5: 1, 6: 3, 7: 5, 8: 7, 9: 9
        };
        return mapping[O] || O; // 找不到對應時保持原值，但根據規則 O 應恆為 1-9
    }

    /**
     * 【新增】計算外心密碼
     * 規則: S + R + T (和的個位數)
     */
    calculateOuterCode(S, R, T) {
        return this.reduceToSingleDigit(S + R + T);
    }

    /**
     * 【新增】計算潛意識密碼
     * 規則: L + I + O (和的個位數)
     */
    calculateSubconsciousCode(L, I, O) {
        return this.reduceToSingleDigit(L + I + O);
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

        const innerCode = this.calculateInnerCode(O);
        const outerCode = this.calculateOuterCode(S, R, T);
        const subconsciousCode = this.calculateSubconsciousCode(L, I, O);
        
        return {
            // 原始數據
            originalDate: { A, B, C, D, E, F, G, H },
            birthDate: { year, month, day },
            // 內三角形
            inner: { I, J, K, L, M, N, O },
            // 外三角形
            outer: { P, Q, R, S, T, U, V, W, X },
            core: {
                innerCode: innerCode,
                outerCode: outerCode,
                subconsciousCode: subconsciousCode
            }
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

        // 【新增】顯示解析內容
        this.generateAnalysis(result);
    }

    /**
     * 更新結果表格
     */
    updateResultsTable(result) {
        const updateElement = (id, value) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        };

        // 【修改】內心密碼、外心密碼、潛意識密碼的顯示
        updateElement('result-main', result.inner.O);
        updateElement('result-inner', result.core.innerCode); // 使用新的內心密碼
        updateElement('result-outer', result.core.outerCode); // 使用新的外心密碼
        updateElement('result-subconscious', result.core.subconsciousCode); // 使用新的潛意識密碼

        // 保持其他項目不變 (但根據您的新定義，這些可能已經不再使用，不過這裡仍保留原邏輯)
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

    /**
     * 【新增】生成解析文字內容
     */
    generateAnalysis(result) {
        const analysisContainer = document.getElementById('analysis-section');
        if (!analysisContainer) return;

        const mainCode = result.inner.O;
        const subconsciousCode = result.core.subconsciousCode;
        const innerCode = result.core.innerCode;
        const outerCode = result.core.outerCode;

        // 1. 主性格解析 (O)
        const mainPersonalityText = this.getMainPersonalityAnalysis(mainCode);
        const mainAnalysis = this.createAnalysisBlock('主性格', mainCode, `主性格代表著主格，佔一個人60%的性格，是一個人在日常生活中最常展現給他人看的性格樣貌。\n\n${mainPersonalityText}`);

        // 2. 潛意識密碼解析 (L + I + O)
        const subconsciousPersonalityText = this.getSubconsciousAnalysis(subconsciousCode);
        const subconsciousAnalysis = this.createAnalysisBlock('潛意識密碼', subconsciousCode, `潛意識密碼象徵你在未經思考下的本能反應與深層動機，是自己沒意識到的特質。\n\n${subconsciousPersonalityText}`);

        // 3. 內心密碼解析 (Inner Code)
        const innerCodeText = this.getInnerCodeAnalysis(innerCode);
        const innerAnalysis = this.createAnalysisBlock('內心密碼', innerCode, `內心密碼代表內心深處的感受與需求，較少透漏給他人。\n\n${innerCodeText}`);

        // 4. 外心密碼解析 (Outer Code)
        const outerCodeText = this.getOuterCodeAnalysis(outerCode);
        const outerAnalysis = this.createAnalysisBlock('外心密碼', outerCode, outerCodeText);


        analysisContainer.innerHTML = ''; // 清空舊內容
        analysisContainer.appendChild(mainAnalysis);
        analysisContainer.appendChild(subconsciousAnalysis);
        analysisContainer.appendChild(innerAnalysis);
        analysisContainer.appendChild(outerAnalysis);
    }

    /**
     * 【新增】創建解析區塊的 HTML 元素
     */
    createAnalysisBlock(title, code, content) {
        const block = document.createElement('div');
        block.className = 'analysis-block';
        block.innerHTML = `
            <h3>${title}：<span class="code-value">${code}</span></h3>
            <p class="description-text">${content.replace(/\n/g, '<br>')}</p>
        `;
        return block;
    }

    /**
     * 【新增】主性格解析邏輯 (O)
     */
    getMainPersonalityAnalysis(O) {
        const analysis = {
            1: '1象徵開始與獨立，天生具備領導力與行動力，喜歡自己做決定，不願受限於他人。重視自我價值與成就感，適合開創型工作。\n需留意過度逞強或以自我為中心，學習與他人合作，能讓力量發揮得更長遠。',
            2: '2重視關係與情感連結，敏感細膩，善於傾聽與體貼他人，是團隊中的潤滑劑。擅長合作與支持，對氛圍與人際互動特別在意。\n需注意容易猶豫或過度迎合，建立界線與自信是成長關鍵。',
            3: '3代表創意、表達與快樂，天性樂觀，擅長語言、藝術與社交，容易成為人群焦點。喜歡分享想法與情緒，生活需要新鮮感。\n需留意情緒起伏與三分鐘熱度，學會專注與持續，能讓才華真正落地。',
            4: '4重視秩序、責任與穩定，是腳踏實地的實幹型人格。做事有計畫、耐力強，適合長期累積的工作。對安全感需求高。\n需注意過於保守或固執，適度接受變化，能讓人生結構更有彈性。',
            5: '5象徵自由與改變，熱愛新體驗，不喜歡被束縛，適應力強。對世界充滿好奇，適合多元、流動性的環境。\n需留意衝動與分心，若能在自由中建立紀律，將能把經驗轉化為真正的智慧。',
            6: '6重視愛、責任與家庭，天生具有照顧他人的傾向，關心他人感受，追求和諧。適合服務、教育或療癒相關角色。\n需注意過度付出與控制，學會先照顧自己，關係才能長久平衡。',
            7: '7代表內省與智慧，喜歡思考人生意義，對知識、真理與精神層面有高度興趣。需要獨處時間，重視內在世界。\n需留意與現實或他人疏離，若能將洞察落實於生活，將成為深具影響力的人。',
            8: '8象徵權力、物質與成就，具備管理能力與現實判斷力，重視效率與成果。適合領導、經營與資源整合。\n需留意過度追求控制或成敗得失，當學會平衡內在價值與外在成功，力量會更穩定。',
            9: '9代表大愛與完成，具有同理心與理想性，關注群體、社會與人類整體福祉。容易被需要，也渴望帶來改變。\n需留意情感消耗與過度犧牲，學會放下與界線，是走向成熟的重要課題。'
        };
        return analysis[O] || '無對應解析內容。';
    }

    /**
     * 【新增】潛意識密碼解析邏輯 (L + I + O)
     * 由於內容與主性格相同，直接調用
     */
    getSubconsciousAnalysis(code) {
        return this.getMainPersonalityAnalysis(code);
    }

    /**
     * 【新增】內心密碼解析邏輯 (Inner Code)
     */
    getInnerCodeAnalysis(code) {
        const analysis = {
            2: '內心碼2的人外在表現獨立、有主見，但內心其實渴望支持與陪伴，因此在重大決定時容易缺乏信心，傾向反覆思量、等待他人給予肯定後才行動。',
            4: '內心碼4的人內心重視安全感與穩定，習慣透過分析與規劃來降低不安，當情緒動盪時，建立計畫或透過書寫整理思緒，反而能發揮不錯的表達能力。',
            6: '內心碼6的人兼具遠見與理想，表面行動力高但偶爾流於草率，內心其實對品質與成果有高度要求，對美感與物質提升特別敏感，也渴望生活越來越豐盛。',
            8: '內心碼8的人在順從規範與追求成就之間拉扯，規劃時往往設定宏大的目標，也因此承受較大壓力，會不斷推動自己朝目標前進並付諸實際行動。',
            1: '內心碼1的人內在自信且具獨立與創造能力，但容易以自我觀點為中心，加上不易接納他人意見，可能在互動中顯得較為強勢或固執。',
            3: '內心碼3的人內心充滿表達與連結的渴望，容易感到焦躁，想透過社交與分享來抒發情緒，但在耐心與持續力上較為不足，性格顯得多變。',
            5: '內心碼5的人內心嚮往自由與多元體驗，興趣廣泛且喜歡玩樂，但因堅持自身原則，容易讓人感覺不易溝通，只要不觸及底線，其實相當有彈性。',
            7: '內心碼7的人願意體貼與包容他人，卻常以理性與冷靜作為外在表現，內在具有強烈的正義感與關懷意識，對重要的人與事會默默放在心上。',
            9: '內心碼9的人對世界充滿好奇與渴望，興趣與想法豐富，容易給人慾望強烈的印象，但內心同時懷有感恩之心，也常主動關懷與幫助他人。'
        };
        return analysis[code] || '無對應解析內容。';
    }

    /**
     * 【新增】外心密碼解析邏輯 (Outer Code)
     */
    getOuterCodeAnalysis(code) {
        const analysis = {
            3: '外心密碼代表一個人的價值觀念。\n\n外心密碼3的人傾向以情緒與氛圍作為判斷依據，帶有理想主義色彩。',
            6: '外心密碼代表一個人的價值觀念。\n\n外心密碼6的人重視實際成果，偏向現實主義。',
            9: '外心密碼代表一個人的價值觀念。\n\n外心密碼9的人對訊息、語言與整體脈絡特別敏感，具有遠見主義特質。'
        };
        return analysis[code] || '無對應解析內容。';
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