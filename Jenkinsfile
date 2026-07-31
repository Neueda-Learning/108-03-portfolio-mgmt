pipeline {
    agent any

    environment {
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        BACKEND_IMAGE = "portfolio-backend"
        FRONTEND_IMAGE = "portfolio-frontend"
        COMPOSE_PROJECT = "portfolio"
    }

    options {
        timestamps()
        timeout(time: 20, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr:'10'))
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'git log -1 --oneline'
            }
        }

        stage('Backend: Build & Test') {
            steps {
                dir('backend') {
                    sh 'chmod +x mvnw || true'
                    sh './mvnw -B clean verify'
                }
            }
            post {
                always {
                    junit testResults: 'backend/target/surefire-reports/*.xml', allowEmptyResults: true
                    script {
                        if (fileExists('backend/target/jacoco.exec')) {
                            archiveArtifacts artifacts: 'backend/target/jacoco.exec', allowEmptyArchive: true
                        }
                        if (fileExists('backend/target/site/jacoco')) {
                            archiveArtifacts artifacts: 'backend/target/site/jacoco/**/*', allowEmptyArchive: true
                        }
                    }
                }
            }
        }

        stage('Frontend: Build') {
            steps {
                sh '''
                docker run --rm \
                  -v "$PWD/frontend:/app" \
                  -w /app \
                  node:20-alpine \
                  sh -lc "npm ci && npm run build"
                '''
            }
        }

        stage('Docker: Build Images') {
            steps {
                sh '''
                docker compose -p ${COMPOSE_PROJECT} down --remove-orphans || true
                docker compose -p ${COMPOSE_PROJECT} build
                docker compose -p ${COMPOSE_PROJECT} up -d
                '''
            }
        }

        stage('Smoke Test') {
            steps {
                sh '''
                echo "Waiting for backend to become healthy"
                for i in $(seq 1 30); do
                    if curl -fs http://localhost:8080/actuator/health | grep -q '\"status\":\"UP\"'; then
                        echo "Backend is up"
                        break
                    fi

                    if [ "$i" = "30" ]; then
                        echo "Backend failed to start"
                        docker compose -p ${COMPOSE_PROJECT} logs --tail=100
                        exit 1
                    fi

                    sleep 5
                done

                echo "Checking core endpoints..."
                curl -fs http://localhost:8080/actuator/health > /dev/null
                echo "Smoke test passed"
                '''
            }
            post {
                always {
                    sh 'docker compose -p ${COMPOSE_PROJECT} down --remove-orphans || true'
                }
            }
        }
    }

    post {
        always {
            cleanWs(deleteDirs: true, notFailBuild: true)
        }
    }
}