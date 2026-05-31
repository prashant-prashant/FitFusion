// Jenkinsfile – FitFusion CI/CD Pipeline (Windows Jenkins Compatible)

pipeline {
agent any

```
environment {
    DB_HOST        = 'mysql'
    IMAGE_BACKEND  = 'fitfusion-backend'
    IMAGE_FRONTEND = 'fitfusion-frontend'
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

            bat '''
                cd backend
                pip install flake8
                flake8 . --max-line-length=120 --exclude=__pycache__
            '''
        }
    }

    // ── Backend: Install & Test ───────────────────────────────
    stage('Backend Test') {
        steps {
            echo '🧪 Running backend unit tests...'

            bat '''
                cd backend
                pip install -r requirements.txt
                pip install pytest
                pytest --tb=short
            '''
        }
    }

    // ── Frontend: Install & Build ─────────────────────────────
    stage('Frontend Build') {
        steps {
            echo '⚛️ Building React frontend...'

            bat '''
                cd frontend
                npm install
                npm run build
            '''
        }
    }

    // ── Docker: Build Images ──────────────────────────────────
    stage('Docker Build') {
        steps {
            echo '🐳 Building Docker images...'

            bat '''
                docker build -t %IMAGE_BACKEND%:latest -f docker/Dockerfile .
                docker build -t %IMAGE_FRONTEND%:latest -f frontend/Dockerfile.frontend ./frontend
            '''
        }
    }

    // ── Docker Push Disabled ─────────────────────────────────
    stage('Docker Push') {
        steps {
            echo '⏭️ Skipping Docker Push for local Jenkins setup...'
        }
    }

    // ── Deploy Disabled ──────────────────────────────────────
    stage('Deploy') {
        steps {
            echo '⏭️ Deployment skipped for local setup.'
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
}
```

}
