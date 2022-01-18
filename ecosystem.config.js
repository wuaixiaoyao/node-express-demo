module.exports = {
  apps: [{
    name: 'node-express', // 项目名称
    cwd: './', // 当前工作路径
    script: 'app.js', // 实际启动脚本
    args: 'start', // 参数
    autorestart: true, // 自动重启
    exec_mode: 'cluster', // 应用启动模式，支持fork和cluster模式 内置的cluster,相当于对node的cluster的封装
    min_uptime: '60s', // 应用运行少于时间被认为是异常启动
    restart_delay: 60, // 重启时延
    instances: 4, // 开启n个实例，仅在cluster模式有效，用于负载均衡
    watch: true, // 监控变化的目录，一旦变化，自动重启
    watch: [], // 监控变化的目录
    watch_delay: 1000, // 监控时延
    ignore_watch: ['node_modules'], // 从监控目录中排除
    watch_options: { // 监听配置
      'followSymlinks': false,
      'usePolling': true
    },
    error_file: 'logs/nuxt-demo-err.log', // 错误日志
    out_file: 'logs/nuxt-demo-out.log', // 正常运行日志
    log_date_format: "YYYY-MM-DD HH:mm:ss", // 给每行日志标记一个时间
    // 默认的环境变量
    env: { 
      "PM2_ENV": "dev"
    },
    // 测试环境
    env_test: {
      "RUNTIME_ENV": "test",
    },
    env_production: {
      "RUNTIME_ENV": "prod",
    }
  }]
}