const { message } = require("telegraf/filters");
const bot = require("./start");
const User = require("../FallahAcountSource/User");
const { Login } = require("./User");

//Global Variable
let isLogin = false;
const emailRegex = /(\w.+)@(\w+).(\w+)/g;
const courses = {
  1: "تجارت الکترونیک امنیت شبکه",
  2: "تجهیزات شبکه",
  3: "وب",
  4: "پیاده سازی و برنامه سازی",
};
const pdmns = [1, 2, 3, 4, 5];
const usr = new User();
let email;
let password;
var botwork = false;
if (botwork) {
bot.start((usr) => {
  usr.reply("به ربات فلاح فاکر خوش امدید!‌ دستور /help را برای راهنمایی ارسال کنید.");
});

bot.help((ctx) => {
  ctx.reply(`
  /email ایمیل خود را وارد کنید
  /password پسورد را وارد کنید
  بعد از ورود از دستور زیر استفاده کنید.
  /course {کد درس} {پودمان}`);
});

bot.on(message("text"), async (ctx) => {
  const { text } = ctx.message;
  if (text.startsWith("/email")) {
    const Clean = text.replace("/email", "").trim();
    if (!Clean.match(emailRegex)) {
      return ctx.reply("please Enter Valid Email");
    }
    email = Clean;
    return ctx.reply(
      "ایمیل ذخیره شد حال پسورد خود را به این شکل ارسال کنید /password *Your password*"
    );
  }
  if (text.startsWith("/password")) {
    if (!email) {
      return ctx.reply("ابتدا ایمیل خود را با دستور  /email *email* ارسال کنید");
    }
    password = text.replace("/password", "").trim();
    ctx.reply("Please Wait!!");
    const Result = await usr.Login(email, password);
    if (Result[0]) {
      ctx.reply(`با موفقیت وارد اکانت ${Result[0]} شدید.`);
      isLogin = true;
      ctx.reply(`لیست درس ها : 
      1)تجارت الکترونیک امنیت شبکه
      2)تجهیزات شبکه
      3)وب
      4)پیاده سازی و برنامه ساز
      `);
      ctx.reply(`(1): "تجارت الکترونیک امنیت شبکه",
  (2): "تجهیزات شبکه",
  (3): "وب",
  (4): "پیاده سازی و برنامه سازی",`);
      ctx.reply(` برای ازمون /course *کد ازمون [1,2,3,4,5]* *پودمان* 
      را ارسال کنید`);
    }
  }
  if (text.startsWith("/course") && isLogin) {
    ctx.reply("Please Wait!!");
    const [course, Pdmn] = text.replace("/course", "").trim().split(" ");
    console.log(course, Pdmn);
    if ((+course) in courses && pdmns.indexOf(+Pdmn) !== -1) {
      console.log("injam");
      const { QuizCount, Currect_Answer, Result } = await usr.Azmon(
        course,
        Pdmn
      );
      console.log(QuizCount, Currect_Answer, Result);
      return ctx.reply(
        `نتیجه :${Result}\n تعداد سوالات:${QuizCount}\n تعداد جواب ها:${Currect_Answer}`
      );
    }
    ctx.reply("لطفا یک پودمان معتبر را ارسال کنید");
    return ctx.reply(`لیست درس ها: 
      1)تجارت الکترونیک امنیت شبکه
      2)تجهیزات شبکه۲
      3)وب
      4)پیاده سازی و برنامه ساز
      `);
  } else if (!isLogin) {
    return ctx.reply(" ابتدا وارد شوید . /help را برای راهنمایی ارسال کنید");
  }
});
} else {
  var msg = "در حال ارتقا ربات هستیم ، لطفا منتظر باشید";
  bot.start((usr) => {
    usr.reply(msg);
  });
  bot.on(message("text"), async (ctx) => {
    ctx.reply(msg);
  });

}

bot.launch();

console.log("Bot is Run");
