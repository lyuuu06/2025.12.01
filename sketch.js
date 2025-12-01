let spriteSheet;
let jumpSpriteSheet;
let hitSpriteSheet;
let animation = [];
let jumpAnimation = [];
let hitAnimation = [];

const frameCountTotal = 12; // 跑步精靈圖的總影格數
const jumpFrameCountTotal = 13; // 跳躍精靈圖的總影格數
const hitFrameCountTotal = 6; // 打擊精靈圖的總影格數
const animationSpeed = 5; // 跑步動畫速度
const jumpAnimationSpeed = 4; // 跳躍動畫速度
const hitAnimationSpeed = 4; // 打擊動畫速度

// 角色屬性
let characterX, characterY;
let groundY; // 地面位置
let moveSpeed = 5;
let direction = 1; // 1: 右, -1: 左
let isMoving = false;

// 跳躍屬性
let isJumping = false;
let velocityY = 0;
let gravity = 0.6;
let jumpForce = -12;
let jumpFrame = 0;

// 打擊屬性
let isHitting = false;
let hitFrame = 0;


function preload() {
  // 預先載入圖片資源
  spriteSheet = loadImage('1/run/run_1.png');
  jumpSpriteSheet = loadImage('1/jump/jump_1.png');
  hitSpriteSheet = loadImage('1/hit/hit_1.png');
}

function setup() {
  // 建立一個全視窗的畫布
  createCanvas(windowWidth, windowHeight);
  
  // --- 處理跑步動畫 ---
  let frameWidth = spriteSheet.width / frameCountTotal;
  let frameHeight = spriteSheet.height;
  for (let i = 0; i < frameCountTotal; i++) {
    let frame = spriteSheet.get(i * frameWidth, 0, frameWidth, frameHeight);
    animation.push(frame);
  }

  // --- 處理跳躍動畫 ---
  let jumpFrameWidth = jumpSpriteSheet.width / jumpFrameCountTotal;
  let jumpFrameHeight = jumpSpriteSheet.height;
  for (let i = 0; i < jumpFrameCountTotal; i++) {
    let frame = jumpSpriteSheet.get(i * jumpFrameWidth, 0, jumpFrameWidth, jumpFrameHeight);
    jumpAnimation.push(frame);
  }
  
  // --- 處理打擊動畫 ---
  let hitFrameWidth = hitSpriteSheet.width / hitFrameCountTotal;
  let hitFrameHeight = hitSpriteSheet.height;
  for (let i = 0; i < hitFrameCountTotal; i++) {
    let frame = hitSpriteSheet.get(i * hitFrameWidth, 0, hitFrameWidth, hitFrameHeight);
    hitAnimation.push(frame);
  }
  
  // 將圖片的繪製模式設定為以中心點為基準
  imageMode(CENTER);

  // 初始化角色位置在畫面中央
  characterX = width / 2;
  characterY = height / 2;
  groundY = height / 2; // 將初始Y位置設為地面
}

function draw() {
  // 設定背景顏色
  background('#f2e9e4');

  // --- 狀態更新 ---
  if (isJumping) {
    // 1. 跳躍狀態 (最高優先級)
    velocityY += gravity; // 套用重力
    characterY += velocityY;
    jumpFrame += 1 / jumpAnimationSpeed;

    // 判斷是否落地
    if (characterY >= groundY) {
      characterY = groundY; // 確保角色回到地面
      isJumping = false;
      jumpFrame = 0;
    }
  } else if (isHitting) {
    // 2. 打擊狀態
    hitFrame += 1 / hitAnimationSpeed;
    if (hitFrame >= hitFrameCountTotal) {
      isHitting = false;
      hitFrame = 0;
    }
  } else {
    // 3. 地面待機/移動狀態
    isMoving = false; // 先假設角色沒有移動
    if (keyIsDown(RIGHT_ARROW)) {
      characterX += moveSpeed;
      direction = 1;
      isMoving = true;
    }
    if (keyIsDown(LEFT_ARROW)) {
      characterX -= moveSpeed;
      direction = -1;
      isMoving = true;
    }
    // 監聽跳躍鍵
    if (keyIsDown(UP_ARROW)) {
      isJumping = true;
      velocityY = jumpForce;
    }
    // 監聽空白鍵 (打擊)
    if (keyIsDown(32)) { // 32 是空白鍵的 keycode
      isHitting = true;
    }
  }

  // --- 繪製角色 ---
  push(); // 儲存當前的繪圖設定
  translate(characterX, characterY); // 將畫布原點移動到角色位置
  scale(direction, 1); // 根據方向翻轉畫布 (1 不變, -1 水平翻轉)
  
  let currentImage;
  if (isJumping) {
    let currentJumpFrameIndex = floor(jumpFrame) % jumpFrameCountTotal;
    currentImage = jumpAnimation[currentJumpFrameIndex];
  } else if (isHitting) {
    let currentHitFrameIndex = floor(hitFrame);
    currentImage = hitAnimation[currentHitFrameIndex];
  } else {
    if (isMoving) {
      // 如果在移動，就播放跑步動畫
      let currentFrameIndex = floor(frameCount / animationSpeed) % frameCountTotal;
      currentImage = animation[currentFrameIndex];
    } else {
      // 如果靜止，就顯示第一個影格
      currentImage = animation[0];
    }
  }
  
  // 在新的原點 (0,0) 繪製角色
  image(currentImage, 0, 0);
  
  pop(); // 恢復原本的繪圖設定
}

// 當瀏覽器視窗大小改變時，自動調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 同時更新地面位置，避免角色懸空或陷入地下
  groundY = height / 2;
}
