const { spawn } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

const tempDir = os.tmpdir();

// C 코드 실행 함수
function runCCode(code) {
    return new Promise((resolve, reject) => {
        const sourceFilePath = path.join(tempDir, 'program.c');
        const outputFilePath = path.join(tempDir, 'program.exe');
        
        fs.writeFileSync(sourceFilePath, code);

        const compiler = spawn('gcc', [sourceFilePath, '-o', outputFilePath]);
        
        compiler.on('close', (code) => {
            if (code === 0) {
                const program = spawn(outputFilePath);
                let result = '';

                program.stdout.on('data', (data) => {
                    result += data.toString();
                });

                program.on('close', () => {
                    resolve({ output: result });
                });

                program.stderr.on('data', (data) => {
                    reject(data.toString());
                });
            } else {
                reject('Compilation failed');
            }
        });

        compiler.stderr.on('data', (data) => {
            reject(data.toString());
        });
    });
}

// C++ 코드 실행 함수
function runCppCode(code) {
    return new Promise((resolve, reject) => {
        const sourceFilePath = path.join(tempDir, 'program.cpp');
        const outputFilePath = path.join(tempDir, 'program.exe');
        
        fs.writeFileSync(sourceFilePath, code);

        const compiler = spawn('g++', [sourceFilePath, '-o', outputFilePath]);
        
        compiler.on('close', (code) => {
            if (code === 0) {
                const program = spawn(outputFilePath);
                let result = '';

                program.stdout.on('data', (data) => {
                    result += data.toString();
                });

                program.on('close', () => {
                    resolve({ output: result });
                });

                program.stderr.on('data', (data) => {
                    reject(data.toString());
                });
            } else {
                reject('Compilation failed');
            }
        });

        compiler.stderr.on('data', (data) => {
            reject(data.toString());
        });
    });
}

// Java 코드 실행 함수
function runJavaCode(code) {
    return new Promise((resolve, reject) => {
        const javaFilePath = path.join(tempDir, 'Main.java');
        const outputDir = tempDir;

        fs.writeFileSync(javaFilePath, code);

        const compiler = spawn('javac', ['-d', outputDir, javaFilePath]);

        compiler.on('close', (code) => {
            if (code === 0) {
                const program = spawn('java', ['-classpath', outputDir, 'Main']);
                let result = '';

                program.stdout.on('data', (data) => {
                    result += data.toString();
                });

                program.on('close', () => {
                    resolve({ output: result });
                });

                program.stderr.on('data', (data) => {
                    reject(data.toString());
                });
            } else {
                reject('Compilation failed');
            }
        });

        compiler.stderr.on('data', (data) => {
            reject(data.toString());
        });
    });
}

// Python 코드 실행 함수
function runPythonCode(code) {
    return new Promise((resolve, reject) => {
        const pythonProgram = spawn('python3', ['-c', code]);
        let result = '';

        pythonProgram.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProgram.on('close', () => {
            resolve({ output: result });
        });

        pythonProgram.stderr.on('data', (data) => {
            reject(data.toString());
        });
    });
}

module.exports = {
    runCCode,
    runCppCode,
    runJavaCode,
    runPythonCode
};
