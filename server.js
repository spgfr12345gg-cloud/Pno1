const express = require('express');
const app = express();
app.use(express.json());

// 🗄️ ฐานข้อมูลจำลอง (ในระบบจริงจะเชื่อมต่อกับ MySQL หรือ MongoDB)
let usersDatabase = [];
let packages = [];

// 1. API: สำหรับแอดมินสร้างบัญชีหลังบ้านโดยเฉพาะ (ตามฟอร์แมตที่ระบุ)
app.post('/api/admin/create-user', (req, res) => {
    const { username, password } = req.body;
    
    // ตรวจสอบเงื่อนไขความปลอดภัยหลังบ้าน เช่น ต้องลงท้ายด้วย @Rp
    if(!username.endsWith('@Rp') || !password.startsWith('Rp99@')) {
        return res.status(400).json({ 
            status: "fail", 
            message: "รูปแบบชื่อหรือรหัสผ่านแอดมินไม่ถูกต้อง! ชื่อต้องจบด้วย @Rp และรหัสต้องขึ้นด้วย Rp99@" 
        });
    }

    const newUser = {
        id: usersDatabase.length + 1,
        username: username,
        password: password, // ในระบบจริงต้องเข้ารหัสผ่านด้วย bcrypt
        canLive: true,      // เปิดฟีเจอร์ไลฟ์สดได้ปกติ
        status: "active",
        metrics: { followers: 0, likes: 0, views: 0, saves: 0, shares: 0 }
    };

    usersDatabase.push(newUser);
    res.status(201).json({ status: "success", message: "สร้างบัญชีผ่านหลังบ้านเรียบร้อย!", data: newUser });
});

// 2. API: สำหรับสร้างแพ็กเกจปั๊มยอด (100, 1000, 2000, 5000)
app.post('/api/admin/create-package', (req, res) => {
    const { targetUserId, type, amount } = req.body; 
    // type = 'followers' | 'likes' | 'views' | 'saves' | 'shares'
    // amount = 100 | 1000 | 2000 | 5000
    
    const allowedAmounts = [100, 1000, 2000, 5000];
    if (!allowedAmounts.includes(amount)) {
        return res.status(400).json({ message: "จำนวนแพ็กเกจต้องเป็น 100, 1000, 2000 หรือ 5000 เท่านั้น" });
    }

    // ค้นหาผู้ใช้เพื่อเติมยอดในระบบ
    const user = usersDatabase.find(u => u.id === targetUserId);
    if (user) {
        user.metrics[type] += amount; // บวกยอดเข้าระบบหลังบ้านทันที
        return res.json({ status: "success", message: `เติมแพ็กเกจ ${type} จำนวน ${amount} สำเร็จแล้ว!`, userMetrics: user.metrics });
    }
    
    res.status(404).json({ message: "ไม่พบผู้ใช้รายนี้" });
});

// รันเซิร์ฟเวอร์หลังบ้านที่พอร์ต 3000
app.listen(3000, () => {
    console.log("🚀 ระบบหลังบ้านสำหรับจัดการแพ็กเกจพร้อมทำงานที่พอร์ต 3000แล้ว!");
});