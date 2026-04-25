module.exports = {
    apps : [
        {
            name : "next-project-booknote",
            script: "node_modules/next/dist/bin/next", /** 앱 실행 스크립트 */
            autorestart : false, /** 프로세스 실패 시 자동으로 재시작 할지 여부 */
            watch: false, /** 파일이 변경 되었을 때 재시작 할지 여부  */
            env_production : {
                NODE_ENV : "production",
                PORT: 3001,
            }
        },
    ]
}