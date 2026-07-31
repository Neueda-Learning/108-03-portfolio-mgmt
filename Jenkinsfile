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
                if docker compose version > /dev/null 2>&1; then
                    COMPOSE_CMD="docker compose"
                elif command -v docker-compose > /dev/null 2>&1; then
                    COMPOSE_CMD="docker-compose"
                else
                    echo "Neither 'docker compose' nor 'docker-compose' is available on this agent"
                    exit 1
                fi

                                # CI override: avoid binding host ports (e.g. 8080/3306) on shared Jenkins agents.
                                cat > docker-compose.ci.yml <<'YAML'
services:
    db:
        ports: []
    backend:
        ports: []
YAML

                                COMPOSE_FILES="-f docker-compose.yml -f docker-compose.ci.yml"

                                $COMPOSE_CMD $COMPOSE_FILES -p ${COMPOSE_PROJECT} down --remove-orphans || true
                                $COMPOSE_CMD $COMPOSE_FILES -p ${COMPOSE_PROJECT} build
                                $COMPOSE_CMD $COMPOSE_FILES -p ${COMPOSE_PROJECT} up -d
                '''
            }
        }

        stage('Smoke Test') {
            steps {
                sh '''
                if docker compose version > /dev/null 2>&1; then
                    COMPOSE_CMD="docker compose"
                elif command -v docker-compose > /dev/null 2>&1; then
                    COMPOSE_CMD="docker-compose"
                else
                    echo "Neither 'docker compose' nor 'docker-compose' is available on this agent"
                    exit 1
                fi

                COMPOSE_FILES="-f docker-compose.yml -f docker-compose.ci.yml"

                echo "Waiting for backend to become healthy"
                for i in $(seq 1 30); do
                    if docker run --rm --network ${COMPOSE_PROJECT}_default curlimages/curl:8.9.1 -fsS http://backend:8080/actuator/health | grep -q '\"status\":\"UP\"'; then
                        echo "Backend is up"
                        break
                    fi

                    if [ "$i" = "30" ]; then
                        echo "Backend failed to start"
                        $COMPOSE_CMD $COMPOSE_FILES -p ${COMPOSE_PROJECT} logs --tail=100
                        exit 1
                    fi

                    sleep 5
                done

                echo "Checking core endpoints..."
                docker run --rm --network ${COMPOSE_PROJECT}_default curlimages/curl:8.9.1 -fsS http://backend:8080/actuator/health > /dev/null
                echo "Smoke test passed"
                '''
            }
            post {
                always {
                    sh '''
                    if docker compose version > /dev/null 2>&1; then
                        docker compose -f docker-compose.yml -f docker-compose.ci.yml -p ${COMPOSE_PROJECT} down --remove-orphans || true
                    elif command -v docker-compose > /dev/null 2>&1; then
                        docker-compose -f docker-compose.yml -f docker-compose.ci.yml -p ${COMPOSE_PROJECT} down --remove-orphans || true
                    else
                        echo "Skipping compose cleanup: no compose command available"
                    fi

                    rm -f docker-compose.ci.yml || true
                    '''
                }
            }
        }
    }

    post {
        always {
            sh '''
            if docker compose version > /dev/null 2>&1; then
                docker compose -f docker-compose.yml -f docker-compose.ci.yml -p ${COMPOSE_PROJECT} down --remove-orphans || true
            elif command -v docker-compose > /dev/null 2>&1; then
                docker-compose -f docker-compose.yml -f docker-compose.ci.yml -p ${COMPOSE_PROJECT} down --remove-orphans || true
            else
                echo "Skipping compose cleanup: no compose command available"
            fi

            rm -f docker-compose.ci.yml || true
            '''
            cleanWs(deleteDirs: true, notFailBuild: true)
        }
    }
}