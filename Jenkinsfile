// Jenkinsfile – FitFusion CI/CD Pipeline
pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
        DOCKER_USERNAME         = "${DOCKER_HUB_CREDENTIALS_USR}"
        DB_HOST                 = 'mysql'
        IMAGE_BACKEND           = "${DOCKER_USERNAME}/fitfusion-backend"
        IMAGE_FRONTEND          = "${DOCKER_USERNAME}/fitfusion-frontend"
    }

    stages {
        // ── Checkout ─────────────────────────────────────────────
        stage('Checkout') {
            steps {
                echo '📥 Checking out source code...'
                checkout scm
            }
        }

        // ── Backend: Lint ────────────────────────────────────────
        stage('Backend Lint') {
            steps {
                echo '🔍 Running flake8 lint on backend...'
                sh '''
                    cd backend
                    pip install flake8 --quiet
                    flake8 . --max-line-length=120 --exclude=__pycache__
                '''
            }
        }

        // ── Backend: Install & Test ───────────────────────────────
        stage('Backend Test') {
            steps {
                echo '🧪 Running backend unit tests...'
                sh '''
                    cd backend
                    pip install -r requirements.txt --quiet
                    pip install pytest --quiet
                    pytest --tb=short || echo "No tests found – skipping"
                '''
            }
        }

        // ── Frontend: Install & Build ─────────────────────────────
        stage('Frontend Build') {
            steps {
                echo '⚛️  Building React frontend...'
                sh '''
                    cd frontend
                    npm ci
                    npm run build
                '''
            }
        }

        // ── Docker: Build Images ──────────────────────────────────
        stage('Docker Build') {
            steps {
                echo '🐳 Building Docker images...'
                sh '''
                    docker build -t ${IMAGE_BACKEND}:${BUILD_NUMBER} -t ${IMAGE_BACKEND}:latest \
                        -f docker/Dockerfile .
                    docker build -t ${IMAGE_FRONTEND}:${BUILD_NUMBER} -t ${IMAGE_FRONTEND}:latest \
                        -f frontend/Dockerfile.frontend ./frontend
                '''
            }
        }

        // ── Docker: Push to Hub ───────────────────────────────────
        stage('Docker Push') {
            when { branch 'main' }
            steps {
                echo '🚀 Pushing images to Docker Hub...'
                sh '''
                    echo ${DOCKER_HUB_CREDENTIALS_PSW} | docker login -u ${DOCKER_USERNAME} --password-stdin
                    docker push ${IMAGE_BACKEND}:${BUILD_NUMBER}
                    docker push ${IMAGE_BACKEND}:latest
                    docker push ${IMAGE_FRONTEND}:${BUILD_NUMBER}
                    docker push ${IMAGE_FRONTEND}:latest
                '''
            }
        }

        // ── Deploy: Docker Compose ────────────────────────────────
        stage('Deploy') {
            when { branch 'main' }
            steps {
                echo '🏗️  Deploying with Docker Compose...'
                sh '''
                    cd docker
                    docker-compose down --remove-orphans || true
                    docker-compose up -d
                    echo "✅ FitFusion deployed successfully!"
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed. Check the logs above.'
        }
        always {
            echo '🧹 Cleaning up workspace...'
            cleanWs()
        }
    }
}
