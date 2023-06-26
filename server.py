import json
from flask import Flask, request
from prometheus_client import CollectorRegistry, generate_latest, Gauge, push_to_gateway

app = Flask(__name__)

metric_value_metric = Gauge('metric_value', 'Metric Value', ['metric_id', 'name', 'startTime', 'label'])

@app.route('/metrics', methods=['POST'])
def collect_metrics():
    metric_data = request.data.decode('utf-8')
    metric_data = parse_metric(metric_data)
    print(metric_data)
    metric_id = metric_data['id']
    name = metric_data['name']
    startTime = metric_data['startTime']
    value = metric_data['value']
    label = metric_data['label']
    
    metric_value_metric.labels(metric_id=metric_id, name=name, startTime=startTime, label=label).set(float(value))
    
    registry = CollectorRegistry()
    registry.register(metric_value_metric)
    push_to_gateway('http://prom-prometheus-pushgateway.default.svc:9091', job='customMetric', registry=registry)
    
    return 'Metrics received'


@app.route("/metrics", methods=["GET"])
def prometheus_metrics():
    # Create a new Prometheus registry
    registry = CollectorRegistry()

    # Register the custom Gauges with the registry
    registry.register(metric_value_metric)

    # Generate the metrics output in the Prometheus text format
    output = generate_latest(registry)

    return output, 200, {"Content-Type": "text/plain"}

def parse_metric(metric):
    metric_data = json.loads(metric)
    
    # Convert values to strings
    metric_data['id'] = str(metric_data['id'])
    metric_data['name'] = str(metric_data['name'])
    metric_data['startTime'] = str(metric_data['startTime'])
    metric_data['value'] = str(metric_data['value'])
    metric_data['label'] = str(metric_data['label'])
    
    return metric_data

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3009)
